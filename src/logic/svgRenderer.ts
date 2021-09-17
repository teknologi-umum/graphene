// Modified Shiki-js SVG Renderer (MIT License)
// https://github.com/shikijs/shiki/blob/main/packages/renderer-svg/src/index.ts
//
// Original author: @octref
// Modified by: @StefansArya
// Modified by: @elianiva
// Types by: @aldy505

import { FontStyle, IThemedToken } from 'shiki';
import type { RendererOptions, SVGAttributes, SVGOutput } from '../types/renderer';

const DEFAULT_CONFIG: Partial<RendererOptions> = {
  fontFamily: 'JetBrainsMono Nerd Font',
  fontSize: 14,
  fontWidth: 8,
  bg: '#2E3440',
  horizontalPadding: 4,
  verticalPadding: 2,
};

export function svgRenderer(options: Partial<RendererOptions>): {
  renderToSVG: (lines: IThemedToken[][], { bg }: { bg?: string }) => SVGOutput;
} {
  const { fontFamily, fontSize, lineHeightToFontSizeRatio, bg: _bg } = Object.assign(DEFAULT_CONFIG, options);

  if (!options.fontWidth) throw new Error("options must have 'fontWidth'");

  const lineHeight = fontSize * lineHeightToFontSizeRatio;

  return {
    renderToSVG(lines, { bg } = { bg: _bg }) {
      let longestLineTextLength = 0;

      lines.forEach((lineTokens) => {
        let lineTextLength = 0;

        lineTokens.forEach((l) => (lineTextLength += l.content.length));

        if (lineTextLength > longestLineTextLength) {
          longestLineTextLength = lineTextLength;
        }
      });

      const lineNrWidth = 4 * options.fontWidth; // up to 1000 lines

      // longest line + left/right 4 char width
      // const bgWidth = (longestLineTextLength + horizontalPadding * 2) * options.fontWidth;
      const bgWidth = longestLineTextLength * options.fontWidth + lineNrWidth;

      // all rows + 2 rows top/bot
      // const bgHeight = (lines.length + verticalPadding * 2) * lineheight;
      const bgHeight = (lines.length + 2) * lineHeight;
      let svg = '';
      svg += `<svg viewBox="0 0 ${bgWidth} ${bgHeight}" width="${bgWidth}" height="${bgHeight}" xmlns="http://www.w3.org/2000/svg">\n`;
      svg += `<rect id="bg" fill="${bg}" width="${bgWidth}" height="${bgHeight}" rx="4"></rect>`;
      svg += '<g id="titlebar" display="block">';
      svg += `<rect width="${bgWidth}" height="32" fill="${bg}" rx="8"/>`;
      svg += `<rect x="12.5" y="8.5" width="17" height="17" rx="8.5" stroke="black" stroke-opacity="0.5" />`;
      svg += `<rect x="34.5" y="8.5" width="17" height="17" rx="8.5" stroke="black" stroke-opacity="0.5" />`;
      svg += `<rect x="56.5" y="8.5" width="17" height="17" rx="8.5" stroke="black" stroke-opacity="0.5" />`;
      svg += '<rect x="13" y="9" width="16" height="16" rx="8" fill="#FF496F"/>';
      svg += '<rect x="35" y="9" width="16" height="16" rx="8" fill="#FFE064"/>';
      svg += '<rect x="57" y="9" width="16" height="16" rx="8" fill="#44D695"/>';
      svg += '</g>';
      svg += `<g id="tokens"  display="block" transform="translate(${
        (getIndentOffset(lines.length) + 1) * options.fontWidth
      }, ${
        // This was originally * 0.25
        lineHeight * 1.2
      })">`;

      lines.forEach((line, index) => {
        if (line.length === 0) {
          svg += `\n`;
        } else {
          const offset = getIndentOffset(index) * options.fontWidth;
          const lineNr = `<tspan x="${offset - 16}" fill="#ffffff" fill-opacity="0.5">${index}</tspan>`;

          svg += `<text font-family="${fontFamily}" font-size="${fontSize}" y="${
            lineHeight * (index + 1)
          }">${lineNr}</text>`;

          svg += `<text font-family="${fontFamily}" font-size="${fontSize}" y="${lineHeight * (index + 1)}">\n`;

          let indent = 0;
          line.forEach((token) => {
            const tokenAttributes = getTokenSVGAttributes(token);
            /**
             * SVG rendering in Sketch/Affinity Photos: `<tspan>` with leading whitespace will render without whitespace
             * Need to manually offset `x`
             */
            if (token.content.startsWith(' ') && token.content.search(/\S/) !== -1) {
              const firstNonWhitespaceIndex = token.content.search(/\S/);

              // Whitespace + content, such as ` foo`
              // Render as `<tspan> </tspan><tspan>foo</tspan>`, where the second `tspan` is offset by whitespace * width
              svg += `<tspan x="${indent * options.fontWidth}" ${tokenAttributes}>${escapeHTML(
                token.content.slice(0, firstNonWhitespaceIndex),
              )}</tspan>`;

              svg += `<tspan x="${
                (indent + firstNonWhitespaceIndex) * options.fontWidth
              }" ${tokenAttributes}>${escapeHTML(token.content.slice(firstNonWhitespaceIndex))}</tspan>`;
            } else {
              svg += `<tspan x="${indent * options.fontWidth}" ${tokenAttributes}>${escapeHTML(token.content)}</tspan>`;
            }
            indent += token.content.length;
          });
          svg += `\n</text>\n`;
        }
      });

      svg = svg.replace(/\n*$/, ''); // Get rid of final new lines
      svg += '</g>';
      svg += '\n</svg>\n';

      return { width: bgWidth, height: bgHeight, svg };
    },
  };
}

const getIndentOffset = (size: string | number) => {
  const numLength = String(size).length;
  switch (numLength) {
    case 1:
      return 2;
    case 2:
      return 1;
    case 3:
      return 0;
  }
};

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHTML = (html: string) => html.replace(/[&<>"']/g, (chr) => HTML_ESCAPES[chr]);

const OPTIONS: Partial<SVGAttributes> = {
  fill: '#fff',
};

function getTokenSVGAttributes(token: IThemedToken) {
  // handle different colour format
  if (token.color.slice(1).length <= 6) OPTIONS.fill = token.color;
  else if (token.color.slice(1).length === 8) {
    const opacity = parseInt(token.color.slice(1 + 6), 16) / 255;
    const roughRoundedOpacity = Math.floor(opacity * 100) / 100;
    OPTIONS.fill = token.color.slice(0, 1 + 6);
    OPTIONS.opacity = roughRoundedOpacity;
  }

  if (token.fontStyle === FontStyle.Bold) OPTIONS['font-weight'] = 'bold';
  if (token.fontStyle === FontStyle.Italic) OPTIONS['font-style'] = 'italic';

  return Object.keys(OPTIONS)
    .reduce((acc, curr) => {
      if (OPTIONS[curr]) return acc.concat(`${curr}="${OPTIONS[curr]}"`);
      return acc.concat('');
    }, [])
    .join(' ');
}
