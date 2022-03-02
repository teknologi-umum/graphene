import flourite from 'flourite';
import sharp from 'sharp';
import * as shiki from 'shiki';
import { SvgRenderer } from '@/logic/svgRenderer';
import { getFontSetup } from '@/logic/getFontSetup';
import { OptionSchema } from '@/schema/options';

function guessLanguage(code: string, lang: string): string {
  const guess = lang !== '' ? lang : flourite(code, { shiki: true, heuristic: true }).language;
  const language = guess === 'unknown' ? 'md' : guess;
  return language;
}

export async function generateImage({
  code,
  lang,
  border,
  format,
  upscale,
  theme,
  font,
  lineNumber,
}: OptionSchema): Promise<{ image: Buffer; length: number; format: string }> {
  const highlighter = await shiki.getHighlighter({ theme });
  const { fontFamily, lineHeightToFontSizeRatio, fontSize, fontWidth } = getFontSetup(font);
  const svgRenderer = new SvgRenderer({
    fontFamily,
    lineHeightToFontSizeRatio,
    fontSize,
    fontWidth,
    withLineNumber: lineNumber,
    lineNumberFg: highlighter.getForegroundColor(),
    bg: highlighter.getBackgroundColor(),
    radius: border.radius,
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

  const borderThickness = border.thickness;
  const borderColour = border.colour;

  // Convert the SVG to PNG
  const codeImage = await sharp({
    create: {
      width: codeFrameMeta.width as number,
      height: codeFrameMeta.height as number,
      channels: 4,
      background: borderThickness !== 0 ? borderColour : { r: 0, g: 0, b: 0, alpha: 0 },
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
