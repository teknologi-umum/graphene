// Modified Shiki-js SVG Renderer (MIT License)
// https://github.com/shikijs/shiki/blob/main/packages/renderer-svg/src/index.ts
//
// Original author: @octref
// Modified by: @StefansArya
// Modified by: @elianiva
// Types by: @aldy505

import { FontStyle, IThemedToken } from 'shiki';
import type { HTMLEscapes, RendererOptions, SVGAttributes, SVGOutput } from '../types/renderer';

const DEFAULT_CONFIG: Partial<RendererOptions> = {
  fontFamily: 'JetBrains Mono',
  fontSize: 14,
  fontWidth: 8,
  bg: '#2E3440',
  fg: '#FFFFFF',
  lineNumber: true,
};

type RenderToSVG = (lines: IThemedToken[][]) => SVGOutput;

export function svgRenderer(options: RendererOptions): {
  renderToSVG: RenderToSVG;
} {
  const { fontFamily, fontSize, lineHeightToFontSizeRatio, bg, fg, fontWidth, lineNumber }: RendererOptions = Object.assign(
    DEFAULT_CONFIG,
    options,
  );

  if (!fontWidth) throw new Error("options must have 'fontWidth'");

  const lineHeight = fontSize * lineHeightToFontSizeRatio;

  return {
    renderToSVG(lines: IThemedToken[][]): SVGOutput {
      let longestLineTextLength = 0;

      lines.forEach((lineTokens) => {
        const lineTextLength = lineTokens.reduce((acc, curr) => (acc += curr.content.length), 0);

        if (lineTextLength > longestLineTextLength) {
          longestLineTextLength = lineTextLength;
        }
      });

      const lineNumberWidth = (lineNumber ? 4 : 2) * fontWidth; // up to 1000 lines
      const titlebarHeight = 32;

      // longest line + left/right 4 char width
      const bgWidth = (longestLineTextLength + 2) * fontWidth + lineNumberWidth;

      // all rows + 2 rows top/bot
      // const bgHeight = (lines.length + verticalPadding * 2) * lineheight;
      const bgHeight = (lines.length + 1) * lineHeight + titlebarHeight;

      let svg = '';
      svg += `<svg viewBox="0 0 ${bgWidth} ${bgHeight}" width="${bgWidth}" height="${bgHeight}" xmlns="http://www.w3.org/2000/svg">\n`;
      svg += `<rect id="bg" fill="${bg}" width="${bgWidth}" height="${bgHeight}" rx="6"></rect>`;
      svg += '<g id="titlebar">';
      svg += `<rect width="${bgWidth}" height="${titlebarHeight}" fill="${bg}" rx="8"/>`;
      svg += '<rect x="13" y="9" width="14" height="14" rx="8" fill="#FF605C"/>';
      svg += '<rect x="35" y="9" width="14" height="14" rx="8" fill="#FFBD44"/>';
      svg += '<rect x="57" y="9" width="14" height="14" rx="8" fill="#00CA4E"/>';
      svg += '</g>';

      // we need to move the code to the right when we have line number
      svg += `<g id="tokens" transform="translate(${lineNumberWidth}, ${titlebarHeight})">`;

      lines.forEach((line, index) => {
        if (line.length === 0) {
          if (lineNumber) svg += generateLineNumber(index, { fontFamily, fontWidth, lineHeight, fg });
          svg += `\n`;
        } else {
          if (lineNumber) svg += generateLineNumber(index, { fontFamily, fontWidth, lineHeight, fg });
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
              svg += `<tspan x="${indent * fontWidth}" ${tokenAttributes}>${escapeHTML(
                token.content.slice(0, firstNonWhitespaceIndex),
              )}</tspan>`;

              svg += `<tspan x="${(indent + firstNonWhitespaceIndex) * fontWidth}" ${tokenAttributes}>${escapeHTML(
                token.content.slice(firstNonWhitespaceIndex),
              )}</tspan>`;
            } else {
              svg += `<tspan x="${indent * fontWidth}" ${tokenAttributes}>${escapeHTML(token.content)}</tspan>`;
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

const getIndentOffset = (size: number): number => {
  const numLength = String(size).length;
  switch (numLength) {
    case 1:
      return 2;
    case 2:
      return 1;
    case 3:
      return 0;
    default:
      return 0;
  }
};

const generateLineNumber = (
  idx: number,
  { fontFamily, fontSize, fontWidth, lineHeight, fg }: Partial<RendererOptions> & { lineHeight: number },
) => {
  const offset = getIndentOffset(idx);
  const lineNumber = `<tspan fill="${fg}" fill-opacity="0.5">${String(idx + 1).padStart(offset, '\u2800')}</tspan>`;

  return `<text font-family="${fontFamily}" font-size="${fontSize}" x="-${3 * (fontWidth as number)}" y="${
    lineHeight * (idx + 1)
  }">${lineNumber}</text>`;
};

const HTML_ESCAPES: HTMLEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHTML = (html: string) => html.replace(/[&<>"']/g, (chr: string) => HTML_ESCAPES[chr]);

const OPTIONS: Partial<SVGAttributes> = {
  fill: '#fff',
};

function getTokenSVGAttributes(token: IThemedToken) {
  // handle different colour format
  if (token.color) {
    if (token.color.slice(1).length <= 6) OPTIONS.fill = token.color;
    else if (token.color.slice(1).length === 8) {
      const opacity = parseInt(token.color.slice(1 + 6), 16) / 255;
      const roughRoundedOpacity = Math.floor(opacity * 100) / 100;
      OPTIONS.fill = token.color.slice(0, 1 + 6);
      OPTIONS.opacity = roughRoundedOpacity;
    }
  }

  if (token.fontStyle === FontStyle.Bold) OPTIONS['font-weight'] = 'bold';
  if (token.fontStyle === FontStyle.Italic) OPTIONS['font-style'] = 'italic';

  return Object.keys(OPTIONS)
    .reduce((acc: string[], curr: string) => {
      if (OPTIONS[curr]) return acc.concat(`${curr}="${OPTIONS[curr]}"`);
      return acc.concat('');
    }, [])
    .join(' ');
}
