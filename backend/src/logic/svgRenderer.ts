// Modified Shiki-js SVG Renderer (MIT License)
// https://github.com/shikijs/shiki/blob/main/packages/renderer-svg/src/index.ts
//
// Original author: @octref
// Modified by: @StefansArya, @elianiva, @krowter
// Types by: @aldy505

import { FontStyle, IThemedToken } from 'shiki';
import type { HTMLEscapes, RendererOptions, SVGAttributes, SVGOutput } from '@/types/renderer';

const HTML_ESCAPES: HTMLEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const OPTIONS: Partial<SVGAttributes> = {
  fill: '#fff',
};

export class SvgRenderer {
  private readonly _fontFamily;
  private readonly _fontSize;
  private readonly _fontWidth;
  private readonly _lineHeight;
  private readonly _withLineNumber;
  private readonly _radius;
  private readonly _lineNumberFg;
  private readonly _bg;

  constructor({
    fontFamily,
    fontSize,
    fontWidth,
    lineHeightToFontSizeRatio,
    withLineNumber,
    bg,
    lineNumberFg,
    radius,
  }: RendererOptions) {
    if (fontFamily === '' || fontSize === 0 || fontWidth === 0) {
      throw TypeError('Bad font argument!');
    }

    this._fontFamily = fontFamily;
    this._fontSize = fontSize;
    this._fontWidth = fontWidth;
    this._withLineNumber = withLineNumber;
    this._radius = radius;
    this._lineNumberFg = lineNumberFg;
    this._bg = bg;
    this._lineHeight = fontSize * lineHeightToFontSizeRatio;
  }

  private _escapeHTML(html: string) {
    return html.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
  }

  private _generateLineNumber(lineNumber: number) {
    if (this._fontWidth === undefined) throw TypeError('fontWidth is undefined.');

    const x = this._fontWidth * 4;
    const content = String(lineNumber).padStart(3, '\u2800'); // \u2800 is an empty braille character

    return `<tspan fill="${this._lineNumberFg}" fill-opacity="0.25" x="-${x}">${content}</tspan>`;
  }

  private _getTokenSVGAttributes(token: IThemedToken) {
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

  public renderToSVG(lines: IThemedToken[][]): SVGOutput {
    let longestLineTextLength = 0;

    lines.forEach((lineTokens) => {
      const lineTextLength = lineTokens.reduce((acc, curr) => (acc += curr.content.length), 0);

      if (lineTextLength > longestLineTextLength) {
        longestLineTextLength = lineTextLength;
      }
    });

    const lineNumberWidth = (this._withLineNumber ? String(lines.length).length + 3 : 2) * this._fontWidth;
    const titlebarHeight = 32;

    // longest line + left/right 4 char width
    const bgWidth = (longestLineTextLength + 4) * this._fontWidth + lineNumberWidth;
    const bgHeight = (lines.length + 1) * this._lineHeight + titlebarHeight;

    // TODO(elianiva): implement arbitrary maxLineWidth from request
    // to enable soft wrapping, set maxLineWidth to a positive integer (say 40)
    // and uncomment the 2 lines below it to adjust the svg size
    const maxLineWidth = null; // characters, coming from request
    // const bgWidth = (maxLineWidth + 4) * fontWidth + lineNumberWidth;
    // const bgHeight = (lines.length + 1) * lineHeight + titlebarHeight + 100; // 100 is arbitrary number

    let offsetY = 0; // account for wrapped lines

    let svg = '';
    svg += `<svg viewBox="0 0 ${bgWidth} ${bgHeight}" width="${bgWidth}" height="${bgHeight}" xmlns="http://www.w3.org/2000/svg">\n`;
    svg += `<rect id="bg" fill="${this._bg}" width="${bgWidth}" height="${bgHeight}" rx="${this._radius}"></rect>`;
    svg += '<g id="titlebar">';
    svg += `<rect width="${bgWidth}" height="${titlebarHeight}" fill="${this._bg}" rx="${this._radius}"/>`;
    svg += '<rect x="13" y="9" width="14" height="14" rx="8" fill="#FF605C"/>';
    svg += '<rect x="35" y="9" width="14" height="14" rx="8" fill="#FFBD44"/>';
    svg += '<rect x="57" y="9" width="14" height="14" rx="8" fill="#00CA4E"/>';
    svg += '</g>';
    svg += `<g id="tokens" transform="translate(${lineNumberWidth}, ${titlebarHeight})">`;

    lines.forEach((line, index) => {
      const idx = index + 1;

      if (line.length === 0) {
        if (this._withLineNumber) {
          const yPosition = this._lineHeight * (idx + offsetY);
          svg += `<text font-family="${this._fontFamily}" font-size="${this._fontSize}" y="${yPosition}">\n`;
          svg += this._generateLineNumber(idx);
          svg += '</text>';
        }
        svg += `\n`;
      } else {
        const yPosition = this._lineHeight * (idx + offsetY);
        svg += `<text font-family="${this._fontFamily}" font-size="${this._fontSize}" y="${yPosition}">\n`;

        if (this._withLineNumber) {
          svg += this._generateLineNumber(idx);
        }

        let indent = 0;
        line.forEach((token) => {
          const tokenAttributes = this._getTokenSVGAttributes(token);

          // chunk excess tokens to be rendered below
          const wrappedTokens: string[] = [];
          let tokenBreakIndex = Infinity;
          let lastWrappedTokenIndex = 0; // so next token know where to continue

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

          /**
           * SVG rendering in Sketch/Affinity Photos: `<tspan>` with leading whitespace will render without whitespace
           * Need to manually offset `x`
           */
          if (token.content.startsWith(' ') && token.content.search(/\S/) !== -1) {
            const firstNonWhitespaceIndex = token.content.search(/\S/);

            // Whitespace + content, such as ` foo`
            // Render as `<tspan> </tspan><tspan>foo</tspan>`, where the second `tspan` is offset by whitespace * width
            svg += `<tspan x="${indent * this._fontWidth}" ${tokenAttributes}>${this._escapeHTML(
              token.content.slice(0, firstNonWhitespaceIndex),
            )}</tspan>`;

            svg += `<tspan x="${
              (indent + firstNonWhitespaceIndex) * this._fontWidth
            }" ${tokenAttributes}>${this._escapeHTML(
              token.content.slice(firstNonWhitespaceIndex, tokenBreakIndex),
            )}</tspan>`;
          } else {
            svg += `<tspan x="${indent * this._fontWidth}" ${tokenAttributes}>${this._escapeHTML(
              token.content.slice(0, tokenBreakIndex),
            )}</tspan>`;
          }

          if (wrappedTokens.length > 0) {
            wrappedTokens.forEach((token) => {
              svg += `<tspan dy="${this._lineHeight}" x="0" ${tokenAttributes}>${this._escapeHTML(token)}</tspan>`;
            });
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
  }
}
