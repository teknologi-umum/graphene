import sharp from 'sharp';
import * as shiki from 'shiki';
import { readFile } from 'fs/promises';
import { svgRenderer as shikiSVGRenderer } from './src/utils/svgRenderer.js';

// IIFE
!(async function () {
  // Theme
  let highlighter = await shiki.getHighlighter({ theme: 'github-dark' });
  let svgRenderer = shikiSVGRenderer({
    bg: '#2E3440',
    fontFamily: 'JetBrainsMono Nerd Font',
    lineHeightToFontSizeRatio: 1.5,
    fontSize: 14,
    fontWidth: 8,
    horizontalPadding: 4,
    verticalPadding: 2,
  });

  // Put your code here
  let language = 'js';
  let code = await readFile('./index.js', { encoding: 'utf-8' });

  // split longer lines
  code = code
    .split('\n')
    .map((line) => {
      const indentSize = line.search(/\S/);
      return line.replace(
        /(?![^\n]{1,120}$)([^\n]{1,120})\s/g,
        `$1\n${' '.repeat(indentSize !== -1 ? indentSize : 0)}`,
      );
    })
    .join('\n');
  let tokens = highlighter.codeToThemedTokens(code, language);
  let { svg, width, height } = svgRenderer.renderToSVG(tokens);

  // Convert the SVG to PNG
  const codeImage = await sharp({
    create: {
      // Create Transparent Background
      width: Math.ceil(width * 1.25),
      height: Math.ceil(height * 1.25),
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

  await sharp({
    create: {
      // Create Grey Background
      width: Math.ceil(width * 1.25 + width * 0.1),
      height: Math.ceil(height * 1.25 + width * 0.1),
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
    .png()
    .toFile('./foo.png');
})();
