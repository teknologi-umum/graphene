import flourite from 'flourite';
import sharp from 'sharp';
import * as shiki from 'shiki';
import { svgRenderer as shikiSVGRenderer } from '../logic/svgRenderer';
import { ValidOptions } from '../types/function';
import { getFontSetup } from '../logic/getFontSetup';

const guessLanguage = (code: string, lang: string): string => {
  const guess = lang || flourite(code, { shiki: true, heuristic: true });
  const language = guess === 'unknown' ? 'md' : guess;
  return language;
};

export async function generateImage({
  code,
  lang,
  border,
  format = 'png',
  upscale = 1,
  theme = 'github-dark',
  font = 'jetbrains mono',
  lineNumber = true,
}: ValidOptions): Promise<{ image: Buffer; length: number; format: string }> {
  const highlighter = await shiki.getHighlighter({ theme });
  const { fontFamily, lineHeightToFontSizeRatio, fontSize, fontWidth } = getFontSetup(font);
  const svgRenderer = shikiSVGRenderer({
    fontFamily,
    lineHeightToFontSizeRatio,
    fontSize,
    fontWidth,
    lineNumber,
    bg: highlighter.getBackgroundColor(),
    fg: highlighter.getForegroundColor(),
  });

  const language = guessLanguage(code, lang);
  const tokens = highlighter.codeToThemedTokens(code, language);

  const { svg } = svgRenderer.renderToSVG(tokens);

  if (format === 'svg') {
    const svgBuffer = Buffer.from(svg);
    return {
      image: svgBuffer,
      format: format,
      length: svgBuffer.byteLength,
    };
  }

  const codeFrame = sharp(Buffer.from(svg), { density: Math.floor(72 * upscale) });
  const codeFrameMeta = await codeFrame.metadata();

  const borderThickness = border?.thickness || 0;
  const borderColour = border?.colour || '#a0adb6';

  // Convert the SVG to PNG
  const codeImage = await sharp({
    create: {
      width: codeFrameMeta.width as number,
      height: codeFrameMeta.height as number,
      channels: 4,
      background: borderColour,
    },
  })
    .composite([{ input: await codeFrame.toBuffer() }])
    .extend({
      left: borderThickness * upscale,
      right: borderThickness * upscale,
      bottom: borderThickness * upscale,
      top: borderThickness * upscale,
      background: borderColour,
    })
    [format]()
    .toBuffer();

  return {
    image: codeImage,
    format: format,
    length: codeImage.byteLength,
  };
}
