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
  fontFamily: 'JetBrainsMono Nerd Font',
  fontSize: 14,
  fontWidth: 8,
  bg: '#2E3440',
  fg: '#FFFFFF',
  lineNumber: true,
};

const generateLineNumber = (idx: number, { fg, fontWidth }: Partial<RendererOptions> & { lineHeight: number }) => {
  return `<tspan fill="${fg}" fill-opacity="0.25" x="-${(fontWidth as number) * 4}">${String(idx + 1).padStart(
    3,
    '\u2800',
  )}</tspan>`;
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
  if (token.fontStyle === FontStyle.None) OPTIONS['font-style'] = 'normal';

  return Object.keys(OPTIONS)
    .reduce((acc: string[], curr: string) => {
      if (OPTIONS[curr]) return acc.concat(`${curr}="${OPTIONS[curr]}"`);
      return acc.concat('');
    }, [])
    .join(' ');
}

export function svgRenderer(options: RendererOptions): {
  renderToSVG: (lines: IThemedToken[][]) => SVGOutput;
} {
  const { fontFamily, fontSize, lineHeightToFontSizeRatio, bg, fg, fontWidth, lineNumber, radius }: RendererOptions =
    Object.assign(DEFAULT_CONFIG, options);

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

      const lineNumberWidth = (lineNumber ? String(lines.length).length + 3 : 2) * fontWidth;
      const titlebarHeight = 32;

      // longest line + left/right 4 char width
      // const bgWidth = (longestLineTextLength + 4) * fontWidth + lineNumberWidth;

      // all rows + 2 rows top/bot
      // const bgHeight = (lines.length + verticalPadding * 2) * lineheight;
      // const bgHeight = (lines.length + 1) * lineHeight + titlebarHeight;

      // to enable soft wrapping, set maxLineWidth to a positive integer (say 40)
      // and uncomment the 2 lines below it to adjust the svg size
      const maxLineWidth = 60; // characters, coming from request
      const bgWidth = (maxLineWidth + 4) * fontWidth + lineNumberWidth;
      const bgHeight = (lines.length + 1) * lineHeight + titlebarHeight + 100; // 100 is arbitrary number

      let offsetY = 0; // account for wrapped lines

      let svg = '';
      svg += `<svg viewBox="0 0 ${bgWidth} ${bgHeight}" width="${bgWidth}" height="${bgHeight}" xmlns="http://www.w3.org/2000/svg">\n`;
      svg += `<rect id="bg" fill="${bg}" width="${bgWidth}" height="${bgHeight}" rx="${radius}"></rect>`;
      svg += '<g id="titlebar">';
      svg += `<rect width="${bgWidth}" height="${titlebarHeight}" fill="${bg}" rx="${radius}"/>`;
      svg += '<rect x="13" y="9" width="14" height="14" rx="8" fill="#FF605C"/>';
      svg += '<rect x="35" y="9" width="14" height="14" rx="8" fill="#FFBD44"/>';
      svg += '<rect x="57" y="9" width="14" height="14" rx="8" fill="#00CA4E"/>';
      svg += '</g>';

      // we need to move the code to the right when we have line number
      svg += `<g id="tokens" transform="translate(${lineNumberWidth}, ${titlebarHeight})">`;

      lines.forEach((line, index) => {
        if (line.length === 0) {
          if (lineNumber) {
            svg += `<text font-family="${fontFamily}" font-size="${fontSize}" y="${
              lineHeight * (index + 1 + offsetY)
            }">\n`;
            svg += generateLineNumber(index, { fontFamily, fontWidth, lineHeight, fg });
            svg += '</text>';
          }
          svg += `\n`;
        } else {
          svg += `<text font-family="${fontFamily}" font-size="${fontSize}" y="${
            lineHeight * (index + 1 + offsetY)
          }">\n`;
          if (lineNumber) svg += generateLineNumber(index, { fontFamily, fontWidth, lineHeight, fg });

          let indent = 0;
          line.forEach((token) => {
            const tokenAttributes = getTokenSVGAttributes(token);
            /**
             * SVG rendering in Sketch/Affinity Photos: `<tspan>` with leading whitespace will render without whitespace
             * Need to manually offset `x`
             */

            let tokenBreakIndex = Infinity;

            // chunk excess tokens to be rendered below
            const wrappedTokens: string[] = [];
            let lastWrappedTokenIndex = 0;

            if (maxLineWidth !== null && indent + token.content.length > maxLineWidth) {
              tokenBreakIndex = maxLineWidth - indent;
              let { content } = token;
              let wrappedTokenBreakIndex = tokenBreakIndex;

              while (content.length > 0) {
                lastWrappedTokenIndex = content.length;

                content = content.slice(wrappedTokenBreakIndex);
                wrappedTokens.push(content.slice(0, maxLineWidth));

                wrappedTokenBreakIndex = maxLineWidth;
              }

              offsetY += wrappedTokens.length - 1;
            }

            if (token.content.startsWith(' ') && token.content.search(/\S/) !== -1) {
              const firstNonWhitespaceIndex = token.content.search(/\S/);

              // Whitespace + content, such as ` foo`
              // Render as `<tspan> </tspan><tspan>foo</tspan>`, where the second `tspan` is offset by whitespace * width
              svg += `<tspan x="${indent * fontWidth}" ${tokenAttributes}>${escapeHTML(
                token.content.slice(0, firstNonWhitespaceIndex),
              )}</tspan>`;

              svg += `<tspan x="${(indent + firstNonWhitespaceIndex) * fontWidth}" ${tokenAttributes}>${escapeHTML(
                token.content.slice(firstNonWhitespaceIndex, tokenBreakIndex),
              )}</tspan>`;
            } else {
              svg += `<tspan x="${indent * fontWidth}" ${tokenAttributes}>${escapeHTML(
                token.content.slice(0, tokenBreakIndex),
              )}</tspan>`;
            }

            if (wrappedTokens.length > 0) {
              wrappedTokens.forEach(
                (token) => (svg += `<tspan dy="${lineHeight}" x="0" ${tokenAttributes}>${escapeHTML(token)}</tspan>`),
              );
              indent = lastWrappedTokenIndex;
            } else {
              indent += token.content.length;
            }
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
