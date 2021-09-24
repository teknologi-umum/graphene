export interface RendererOptions {
  fontWidth: number;
  fontFamily: string;
  fontSize: number;
  lineHeightToFontSizeRatio: number;
  bg?: string;
  fg?: string;
  lineNumber: boolean;
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
