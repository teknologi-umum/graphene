// Modified Shiki-js SVG Renderer (MIT License)
// https://github.com/shikijs/shiki/blob/main/packages/renderer-svg/src/index.ts
//
// Original author: octref
// Modified by: StefansArya

import { IThemedToken } from 'shiki';
import type { RendererOptions, SVGOutput } from '../types/renderer';

export const svgRenderer = (
  options: RendererOptions,
): { renderToSVG: (lines: IThemedToken[][], { bg }: { bg: string }) => SVGOutput } => {
  const fontNameStr = options.fontFamily;
  const lineHeightToFontSizeRatio = options.lineHeightToFontSizeRatio || 1.4;
  const _bg = options.bg || '#fff';
  const bgCornerRadius = options.bgCornerRadius || 4;
  const bgSideCharPadding = options.bgSideCharPadding || 4;
  const bgVerticalCharPadding = options.bgVerticalCharPadding || 2;

  if (!options.fontWidth) throw new Error("options must have 'fontWidth'");

  if (!options.fontSize) throw new Error("options must have 'fontSize'");

  const fontSize = options.fontSize || 16;
  const lineheight = options.fontSize * lineHeightToFontSizeRatio;

  return {
    renderToSVG(lines: IThemedToken[][], { bg } = { bg: _bg }): SVGOutput {
      let longestLineTextLength = 0;
      lines.forEach((lTokens) => {
        let lineTextLength = 0;
        lTokens.forEach((l) => (lineTextLength += l.content.length));
        if (lineTextLength > longestLineTextLength) {
          longestLineTextLength = lineTextLength;
        }
      });

      /**
       * longest line + left/right 4 char width
       */
      const bgWidth = (longestLineTextLength + bgSideCharPadding * 2) * options.fontWidth;

      /**
       * all rows + 2 rows top/bot
       */
      const bgHeight = (lines.length + bgVerticalCharPadding * 2) * lineheight;
      let svg = '';
      svg += `<svg viewBox="0 0 ${bgWidth} ${bgHeight}" width="${bgWidth}" height="${bgHeight}" xmlns="http://www.w3.org/2000/svg">\n`;
      svg += `<rect id="bg" fill="${bg}" width="${bgWidth}" height="${bgHeight}" rx="${bgCornerRadius}"></rect>`;
      svg += `<g id="tokens" transform="translate(${options.fontWidth * bgSideCharPadding}, ${
        lineheight * bgVerticalCharPadding
      })">`;

      lines.forEach((l, index) => {
        if (l.length === 0) {
          svg += `\n`;
        } else {
          svg += `<text font-family="${fontNameStr}" font-size="${fontSize}" y="${lineheight * (index + 1)}">\n`;
          let indent = 0;
          l.forEach((token) => {
            const tokenAttributes = getTokenSVGAttributes(token);
            /**
             * SVG rendering in Sketch/Affinity Photos: `<tspan>` with leading whitespace will render without whitespace
             * Need to manually offset `x`
             */
            if (token.content.startsWith(' ') && token.content.search(/\S/) !== -1) {
              const firstNonWhitespaceIndex = token.content.search(/\S/);
              // Whitespace + content, such as ` foo`
              // Render as `<tspan> </tspan><tspan>foo</tspan>`, where the second `tspan` is offset by whitespace * width
              svg += `<tspan x="${indent * options.fontWidth}" ${tokenAttributes}>${escapeHtml(
                token.content.slice(0, firstNonWhitespaceIndex),
              )}</tspan>`;
              svg += `<tspan x="${
                (indent + firstNonWhitespaceIndex) * options.fontWidth
              }" ${tokenAttributes}>${escapeHtml(token.content.slice(firstNonWhitespaceIndex))}</tspan>`;
            } else {
              svg += `<tspan x="${indent * options.fontWidth}" ${tokenAttributes}>${escapeHtml(token.content)}</tspan>`;
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
};

const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(html: string) {
  return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);
}

function getTokenSVGAttributes(token: IThemedToken) {
  const options = {
    fill: '#fff',
    opacity: 0,
    'font-weight': '',
    'font-style': '',
  };

  if (token.color.slice(1).length <= 6) options.fill = token.color;
  else if (token.color.slice(1).length === 8) {
    const opacity = parseInt(token.color.slice(1 + 6), 16) / 255;
    const roughRoundedOpacity = Math.floor(opacity * 100) / 100;
    options.fill = token.color.slice(0, 1 + 6);
    options.opacity = roughRoundedOpacity;
  }

  if (token.fontStyle === 2 /* Bold */) options['font-weight'] = 'bold';
  if (token.fontStyle === 1 /* Italic */) options['font-style'] = 'italic';

  const attrStrs = [];
  for (const o in options) {
    if (options[o]) {
      attrStrs.push(`${o}="${options[o]}"`);
    }
  }

  return attrStrs.join(' ');
}
