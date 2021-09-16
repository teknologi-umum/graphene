// Modified Shiki-js SVG Renderer (MIT License)
// https://github.com/shikijs/shiki/blob/main/packages/renderer-svg/src/index.ts
//
// Original author: @octref
// Modified by: @StefansArya
// Modified by: @elianiva

const DEFAULT_CONFIG = {
  fontFamily: '',
  fontSize: 16,
  lineHeightToFontSizeRatio: 1.4,
  bg: '#fff',
  horizontalPadding: 4,
  verticalPadding: 2,
};

/**
 * @param {Record<String, any>} options
 */
export function svgRenderer(options) {
  const { fontFamily, fontSize, lineHeightToFontSizeRatio, bg: _bg } = Object.assign(DEFAULT_CONFIG, options);

  if (!options.fontWidth) throw new Error("options must have 'fontWidth'");

  let lineHeight = fontSize * lineHeightToFontSizeRatio;

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
      const bgHeight = (lines.length + 1) * lineHeight;

      let svg = '';
      svg += `<svg viewBox="0 0 ${bgWidth} ${bgHeight}" width="${bgWidth}" height="${bgHeight}" xmlns="http://www.w3.org/2000/svg">\n`;
      svg += `<rect id="bg" fill="${bg}" width="${bgWidth}" height="${bgHeight}" rx="4"></rect>`;
      svg += '<g id="titlebar">';
      svg += `<rect width="${bgWidth}" height="32" fill="${bg}" rx="8"/>`;
      svg += '<rect x="13" y="9" width="14" height="14" rx="8" fill="#FF496F"/>';
      svg += '<rect x="35" y="9" width="14" height="14" rx="8" fill="#FFE064"/>';
      svg += '<rect x="57" y="9" width="14" height="14" rx="8" fill="#44D695"/>';
      svg += '</g>';
      svg += `<g id="tokens" transform="translate(${(getIndentOffset(lines.length) + 1) * options.fontWidth}, ${
        lineHeight * 0.25
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
            let tokenAttributes = getTokenSVGAttributes(token);
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

const getIndentOffset = (size) => {
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

const escapeHTML = (html) => html.replace(/[&<>"']/g, (chr) => HTML_ESCAPES[chr]);

const FONT_STYLE = {
  ITALIC: 1,
  BOLD: 2,
};

const OPTIONS = {
  fill: '#fff',
  opacity: undefined,
  'font-weight': undefined,
  'font-style': undefined,
};

function getTokenSVGAttributes(token) {
  // handle different colour format
  if (token.color.slice(1).length <= 6) OPTIONS.fill = token.color;
  else if (token.color.slice(1).length === 8) {
    const opacity = parseInt(token.color.slice(1 + 6), 16) / 255;
    const roughRoundedOpacity = Math.floor(opacity * 100) / 100;
    OPTIONS.fill = token.color.slice(0, 1 + 6);
    OPTIONS.opacity = roughRoundedOpacity;
  }

  if (token.fontStyle === FONT_STYLE.BOLD) OPTIONS['font-weight'] = 'bold';
  if (token.fontStyle === FONT_STYLE.ITALIC) OPTIONS['font-style'] = 'italic';

  return Object.keys(OPTIONS)
    .reduce((acc, curr) => {
      if (OPTIONS[curr]) return acc.concat(`${curr}="${OPTIONS[curr]}"`);
      return acc.concat('');
    }, [])
    .join(' ');
}
