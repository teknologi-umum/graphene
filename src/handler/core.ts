import * as shiki from 'shiki';
import sharp from 'sharp';
import { validate } from '../logic/validate';
import { svgRenderer as shikiSVGRenderer } from '../logic/svgRenderer';
import logger from '../utils/logger';
import type { Middleware } from 'polka';
import flourite from 'flourite';
import { ImageFormat } from '../types/image';

interface RequestBody {
  code: string;
  lang: string;
  format: ImageFormat;
  upscale: number;
  theme: shiki.Theme;
}

export const coreHandler: Middleware = async (req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: "Body can't be empty!" }));
    return;
  }

  const { code, lang, format = 'png', upscale, theme = 'github-dark' }: RequestBody = req.body;
  const err = validate(req.body);

  if (err.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: err }));
    return;
  }

  try {
    const highlighter = await shiki.getHighlighter({ theme });
    const svgRenderer = shikiSVGRenderer({
      fontFamily: 'JetBrainsMono Nerd Font',
      lineHeightToFontSizeRatio: 1.5,
      fontSize: 14,
      fontWidth: 8.4,
      bg: highlighter.getBackgroundColor(),
      fg: highlighter.getForegroundColor(),
    });

    // Guess the language using Flourite
    const guess = lang || flourite(code, { shiki: true, heuristic: true });
    const language = guess === 'unknown' ? 'md' : guess;

    const tokens = highlighter.codeToThemedTokens(code, language);
    const { svg } = svgRenderer.renderToSVG(tokens);

    const border = {
      size: 20,
      colour: { r: 160, g: 173, b: 182, alpha: 1 },
    };
    const codeFrame = sharp(Buffer.from(svg), { density: 72 * upscale });
    const codeFrameMeta = await codeFrame.metadata();

    // Convert the SVG to PNG
    const codeImage = await sharp({
      create: {
        // Create Transparent Background
        width: codeFrameMeta.width as number,
        height: codeFrameMeta.height as number,
        channels: 4,
        background: border.colour,
      },
    })
      .composite([
        {
          // Draw the SVG in front of the background
          input: await codeFrame.toBuffer(),
        },
      ])
      .extend({
        left: border.size,
        right: border.size,
        bottom: border.size,
        top: border.size,
        background: border.colour,
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
