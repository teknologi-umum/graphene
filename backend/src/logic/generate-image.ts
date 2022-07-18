import flourite from "flourite";
import sharp from "sharp";
import * as shiki from "shiki";
import { SvgRenderer } from "~/logic/svg-renderer";
import type { OptionSchema } from "~/schema/options";
import { FONT_MAPPING } from "~/constants";

function guessLanguage(code: string, lang: string | null): string {
  const guess = lang === null ? flourite(code, { shiki: true, heuristic: true }).language : lang;
  const language = guess === "unknown" ? "md" : guess;
  return language;
}

export async function generateImage({
  code,
  language,
  border,
  imageFormat,
  upscale,
  theme,
  font,
  usingLineNumber
}: OptionSchema): Promise<{ image: Buffer; length: number; format: string }> {
  const highlighter = await shiki.getHighlighter({ theme });
  const fontConfig = FONT_MAPPING[font];

  const svgRenderer = new SvgRenderer({
    ...fontConfig,
    usingLineNumber,
    lineNumberForeground: highlighter.getForegroundColor(),
    background: highlighter.getBackgroundColor(),
    radius: border.radius
  });

  const guessedLanguage = guessLanguage(code, language);
  const tokens = highlighter.codeToThemedTokens(code, guessedLanguage);
  const { svg } = svgRenderer.renderToSVG(tokens);

  if (imageFormat === "svg") {
    const svgBuffer = Buffer.from(svg);
    return {
      image: svgBuffer,
      format: imageFormat,
      length: svgBuffer.byteLength
    };
  }

  const codeFrame = sharp(Buffer.from(svg), {
    density: Math.floor(72 * upscale)
  });
  const codeFrameMeta = await codeFrame.metadata();

  const borderThickness = border.thickness;
  const borderColour = border.colour;

  // Convert the SVG to PNG
  const codeImage = await sharp({
    create: {
      width: codeFrameMeta.width as number,
      height: codeFrameMeta.height as number,
      channels: 4,
      background: borderThickness !== 0 ? borderColour : { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: await codeFrame.toBuffer() }])
    .extend({
      left: borderThickness * upscale,
      right: borderThickness * upscale,
      bottom: borderThickness * upscale,
      top: borderThickness * upscale,
      background: borderColour
    })
    [imageFormat]()
    .toBuffer();

  return {
    image: codeImage,
    format: imageFormat,
    length: codeImage.byteLength
  };
}
