// Modified Shiki-js SVG Renderer (MIT License)
// https://github.com/shikijs/shiki/blob/main/packages/renderer-svg/src/index.ts
//
// Original author: @octref
// Modified by: @StefansArya, @elianiva, @krowter
// Types by: @aldy505

import { FontStyle, IThemedToken } from "shiki";

interface SVGOutput {
  width: number;
  height: number;
  svg: string;
}

interface RendererOptions {
  fontWidth: number;
  fontFamily: string;
  fontSize: number;
  lineHeightToFontSizeRatio: number;
  background: string;
  lineNumberForeground: string;
  usingLineNumber: boolean;
  radius: number;
}

export class SvgRenderer {
  private readonly _fontFamily: string;
  private readonly _fontSize: number;
  private readonly _fontWidth: number;
  private readonly _lineHeight: number;
  private readonly _usingLineNumber: boolean;
  private readonly _radius: number;
  private readonly _lineNumberForeground: string;
  private readonly _background: string;
  private readonly HTML_ESCAPES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  private readonly BUTTON_COLOUR = {
    red: "#FF605C",
    yellow: "#FFBD44",
    green: "#00CA4E"
  };

  constructor(options: RendererOptions) {
    this._fontFamily = options.fontFamily;
    this._fontSize = options.fontSize;
    this._fontWidth = options.fontWidth;
    this._usingLineNumber = options.usingLineNumber;
    this._radius = options.radius;
    this._lineNumberForeground = options.lineNumberForeground;
    this._background = options.background;
    this._lineHeight = options.fontSize * options.lineHeightToFontSizeRatio;
  }

  private _escapeHTML(text: string) {
    return text.replace(/[&<>"']/g, (c) => this.HTML_ESCAPES[c]);
  }

  private _generateLineNumber(lineNumber: number) {
    // \u2800 is an empty braille character, we can't use an empty whitespace character
    //  because it will get truncated
    const content = lineNumber.toString().padStart(3, "\u2800");
    return `<tspan fill="${this._lineNumberForeground}" fill-opacity="0.25" x="-${
      this._fontWidth * 4
    }">${content}</tspan>`;
  }

  private _getTokenSVGAttributes(token: IThemedToken) {
    const options = new Map<string, string>();
    options.set("fill", this._lineNumberForeground);

    // handle different colour format
    if (token.color !== undefined) {
      const poundStrippedHex = token.color.slice(1);
      const hasAlphaChannel = poundStrippedHex.length === 8;

      if (!hasAlphaChannel) {
        // handles #rrggbb or #rgb
        options.set("fill", token.color);
      } else {
        const nonAlphaLength = "#rrggbb".length;

        // handles #rrggbbaa
        const opacity = parseInt(token.color.slice(nonAlphaLength), 16) / 255;
        const roughRoundedOpacity = Math.floor(opacity * 100) / 100;
        options.set("opacity", roughRoundedOpacity.toString());

        // omit the alpha channel (last two character)
        options.set("fill", token.color.slice(0, nonAlphaLength));
      }
    }

    // configure font style
    if (token.fontStyle === FontStyle.Bold) {
      options.set("font-weight", "bold");
    }
    if (token.fontStyle === FontStyle.Italic) {
      options.set("font-style", "italic");
    }
    if (token.fontStyle === FontStyle.None) {
      options.set("font-style", "normal");
    }

    return [...options.entries()]
      .filter((option) => option[1] !== "")
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
  }

  public renderToSVG(lines: IThemedToken[][]): SVGOutput {
    let longestLineTextLength = 0;

    for (const lineTokens of lines) {
      const lineTextLength = lineTokens.reduce((sum, current) => (sum += current.content.length), 0);

      if (lineTextLength > longestLineTextLength) {
        longestLineTextLength = lineTextLength;
      }
    }

    const totalLines = lines.length.toString().length + 3;
    const lineNumberWidth = (this._usingLineNumber ? totalLines : 2) * this._fontWidth;
    const titlebarHeight = 32;

    // longest line + left/right 4 char width
    const backgroundWidth = (longestLineTextLength + 4) * this._fontWidth + lineNumberWidth;
    const backgroundHeight = (lines.length + 1) * this._lineHeight + titlebarHeight;

    // TODO(elianiva): implement arbitrary maxLineWidth from request
    // to enable soft wrapping, set maxLineWidth to a positive integer (say 40)
    // and uncomment the 2 lines below it to adjust the svg size
    const maxLineWidth = null; // characters, coming from request
    // const bgWidth = (maxLineWidth + 4) * fontWidth + lineNumberWidth;
    // const bgHeight = (lines.length + 1) * lineHeight + titlebarHeight + 100; // 100 is arbitrary number

    let offsetY = 0; // account for wrapped lines

    let svg = "";
    svg += `<svg viewBox="0 0 ${backgroundWidth} ${backgroundHeight}" width="${backgroundWidth}" height="${backgroundHeight}" xmlns="http://www.w3.org/2000/svg">\n`;
    svg += `<rect id="bg" fill="${this._background}" width="${backgroundWidth}" height="${backgroundHeight}" rx="${this._radius}"></rect>`;
    svg += '<g id="titlebar">';
    svg += `<rect width="${backgroundWidth}" height="${titlebarHeight}" fill="${this._background}" rx="${this._radius}"/>`;
    svg += `<rect x="13" y="9" width="14" height="14" rx="8" fill="${this.BUTTON_COLOUR.red}"/>`;
    svg += `<rect x="35" y="9" width="14" height="14" rx="8" fill="${this.BUTTON_COLOUR.yellow}"/>`;
    svg += `<rect x="57" y="9" width="14" height="14" rx="8" fill="${this.BUTTON_COLOUR.green}"/>`;
    svg += "</g>";
    svg += `<g id="tokens" transform="translate(${lineNumberWidth}, ${titlebarHeight})">`;

    lines.forEach((line, idx) => {
      const index = idx + 1;
      const isLineEmpty = line.length === 0;

      if (isLineEmpty) {
        if (this._usingLineNumber) {
          const yPosition = this._lineHeight * (index + offsetY);
          svg += `<text font-family="${this._fontFamily}" font-size="${this._fontSize}" y="${yPosition}">\n`;
          svg += this._generateLineNumber(index);
          svg += "</text>";
        }
        svg += `\n`;
      } else {
        const yPosition = this._lineHeight * (index + offsetY);
        svg += `<text font-family="${this._fontFamily}" font-size="${this._fontSize}" y="${yPosition}">\n`;

        if (this._usingLineNumber) {
          svg += this._generateLineNumber(index);
        }

        let indent = 0;
        for (const token of line) {
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
          if (token.content.startsWith(" ") && token.content.search(/\S/) !== -1) {
            const firstNonWhitespaceIndex = token.content.search(/\S/);

            // Whitespace + content, such as ` foo`
            // Render as `<tspan> </tspan><tspan>foo</tspan>`, where the second `tspan` is offset by whitespace * width
            // no need to escape since it's just a whitespace

            // render whitespace
            const whitespace = token.content.slice(0, firstNonWhitespaceIndex);
            svg += `<tspan x="${indent * this._fontWidth}" ${tokenAttributes}>${whitespace}</tspan>`;

            // render content
            const escapedContent = this._escapeHTML(token.content.slice(firstNonWhitespaceIndex, tokenBreakIndex));
            const whitespaceOffset = (indent + firstNonWhitespaceIndex) * this._fontWidth;
            svg += `<tspan x="${whitespaceOffset}" ${tokenAttributes}>${escapedContent}</tspan>`;
          } else {
            const escapedContent = this._escapeHTML(token.content.slice(0, tokenBreakIndex));
            const xPosition = indent * this._fontWidth;
            svg += `<tspan x="${xPosition}" ${tokenAttributes}>${escapedContent}</tspan>`;
          }

          if (wrappedTokens.length > 0) {
            for (const token of wrappedTokens) {
              svg += `<tspan dy="${this._lineHeight}" x="0" ${tokenAttributes}>${this._escapeHTML(token)}</tspan>`;
            }
            indent = lastWrappedTokenIndex;
          } else {
            indent += token.content.length;
          }
        }

        svg += `\n</text>\n`;
      }
    });

    svg = svg.replace(/\n*$/, ""); // Get rid of final new lines
    svg += "</g>";
    svg += "\n</svg>\n";

    return { width: backgroundWidth, height: backgroundHeight, svg };
  }
}
