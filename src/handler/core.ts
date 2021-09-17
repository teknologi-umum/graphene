import * as shiki from 'shiki';
import sharp from 'sharp';
import { validate } from '../logic/validate';
import { svgRenderer as shikiSVGRenderer } from '../logic/svgRenderer';
import logger from '../utils/logger';
import type { Middleware } from 'polka';
import flourite from 'flourite';

export const coreHandler: Middleware = async (req, res) => {
  if (!req.body || !Object.keys(req.body).length) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: "Body can't be empty!" }));
    return;
  }

  const { code, lang, format = 'png', upscale, theme = 'github-dark' } = req.body;
  const err = validate(req.body);

  if (err.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ msg: err }));
    return;
  }

  try {
    const highlighter = await shiki.getHighlighter({ theme });
    const svgRenderer = shikiSVGRenderer({
      bg: '#2E3440',
      fontFamily: 'JetBrainsMono Nerd Font',
      lineHeightToFontSizeRatio: 1.5,
      fontSize: 14,
      fontWidth: 8.25,
      horizontalPadding: 4,
      verticalPadding: 2,
    });

    // Guess the language using Flourite
    const guess = lang || flourite(code, { shiki: true, heuristic: true });
    const language = guess === 'unknown' ? 'md' : guess;

    // split longer lines
    const processedCode = code
      .split('\n')
      .map((line: string) => {
        const indentSize = line.search(/\S/);
        return line.replace(
          /(?![^\n]{1,120}$)([^\n]{1,120})\s/g,
          `$1\n${' '.repeat(indentSize !== -1 ? indentSize : 0)}`,
        );
      })
      .join('\n');

    const tokens = highlighter.codeToThemedTokens(processedCode, language);
    const { svg, width, height } = svgRenderer.renderToSVG(tokens, {});

    // Convert the SVG to PNG
    const codeImage = await sharp({
      create: {
        // Create Transparent Background
        width: Math.ceil(width * 1.5),
        height: Math.ceil(height * 1.5),
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          // Draw the SVG in front of the background
          input: Buffer.from(svg),
          blend: 'over',
          gravity: 'centre',
          density: 88,
        },
      ])
      .png()
      .toBuffer();

    const imageWidth = Math.ceil(width * 1.5 + 20);
    const imageHeight = Math.ceil(height * 1.5 + 20);
    const codeWithBG: Buffer = await sharp({
      create: {
        // Create Grey Background
        width: imageWidth,
        height: imageHeight,
        channels: 4,
        background: { r: 212, g: 212, b: 212, alpha: 1 },
      },
    })
      .composite([
        {
          input: codeImage,
          blend: 'over',
          gravity: 'centre',
        },
      ])
      // .resize(imgWidth * upscale)
      [format]()
      .toBuffer();

    const imageResult: Buffer = upscale
      ? await sharp(codeWithBG)
          .resize(imageWidth * upscale, imageHeight * upscale, { fit: 'fill' })
          .toBuffer()
      : codeWithBG;

    res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': imageResult.length }).end(imageResult);
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