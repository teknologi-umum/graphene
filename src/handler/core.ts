import * as shiki from 'shiki';
import sharp from 'sharp';
import { validate } from '../logic/validate';
import { svgRenderer as shikiSVGRenderer } from '../logic/svgRenderer';
import logger from '../utils/logger';
import type { Middleware } from 'polka';
import flourite from 'flourite';
import { ImageFormat } from '../types/image';
import { getFontSetup } from '../logic/getFontSetup';

interface RequestBody {
  code: string;
  lang: string;
  format: ImageFormat;
  upscale: number;
  border: {
    thickness: number;
    colour: string;
  };
  theme: shiki.Theme;
  font: 'jetbrains mono' | 'sf mono' | 'fira code';
  lineNr: boolean;
}

export const coreHandler: Middleware = async (req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: "Body can't be empty!" }));
    return;
  }

  const {
    code,
    lang,
    border,
    format = 'png',
    upscale = 1,
    theme = 'github-dark',
    font = 'jetbrains mono',
    lineNr = true,
  }: RequestBody = req.body;
  const err = validate(req.body);

  if (err.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: err }));
    return;
  }

  try {
    const highlighter = await shiki.getHighlighter({ theme });
    const { fontFamily, lineHeightToFontSizeRatio, fontSize, fontWidth } = getFontSetup(font);
    const svgRenderer = shikiSVGRenderer({
      fontFamily,
      lineHeightToFontSizeRatio,
      fontSize,
      fontWidth,
      lineNr,
      bg: highlighter.getBackgroundColor(),
      fg: highlighter.getForegroundColor(),
    });

    // Guess the language using Flourite
    const guess = lang || flourite(code, { shiki: true, heuristic: true });
    const language = guess === 'unknown' ? 'md' : guess;

    const tokens = highlighter.codeToThemedTokens(code, language);
    const { svg } = svgRenderer.renderToSVG(tokens);

    const codeFrame = sharp(Buffer.from(svg), { density: Math.floor(72 * upscale) });
    const codeFrameMeta = await codeFrame.metadata();

    const borderThickness = border?.thickness || 0;
    const borderColour = border?.colour || '#a0adb6';

    // Convert the SVG to PNG
    const codeImage = await sharp({
      create: {
        width: codeFrameMeta.width as number,
        height: codeFrameMeta.height as number,
        channels: 4,
        background: borderColour,
      },
    })
      .composite([{ input: await codeFrame.toBuffer() }])
      .extend({
        left: borderThickness,
        right: borderThickness,
        bottom: borderThickness,
        top: borderThickness,
        background: borderColour,
      })
      [format]()
      .toBuffer();

    res.writeHead(200, { 'Content-Type': `image/${format}`, 'Content-Length': codeImage.length }).end(codeImage);
  } catch (err) {
    process.env.NODE_ENV !== 'production' && console.log(err);
    logger.captureException(err, (scope) => {
      scope.setContext('request_header', {
        'Content-Type': req.headers['content-type'],
        Origin: req.headers['origin'],
        Accept: req.headers['accept'],
        'User-Agent': req.headers['user-agent'],
      });
      scope.setContext('request_body', { ...req.body });
      scope.setTags({ lang });
      return scope;
    });

    res
      .writeHead(500, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ msg: 'Something went wrong on our side.' }));
  }
};
