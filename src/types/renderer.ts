export interface RendererOptions {
  fontWidth: number;
  fontFamily: string;
  fontSize: number;
  lineHeightToFontSizeRatio: number;
  bg: string;
  horizontalPadding: number;
  verticalPadding: number;
}

export interface SVGOutput {
  width: number;
  height: number;
  svg: string;
}

export interface SVGAttributes {
  fill: string;
  opacity: number;
  'font-style': string;
  'font-weight': string;
}

export interface HTMLEscapes {
  '&': string;
  '<': string;
  '>': string;
  '"': string;
  "'": string;
}

export enum FONT_STYLE {
  NotSet = -1,
  None = 0,
  Italic = 1,
  Bold = 2,
  Underline = 4,
}
