export interface RendererOptions {
  fontFamily: string;
  fontWidth: number;
  fontSize: number;
  lineHeightToFontSizeRatio: number;
  bg: string;
  bgCornerRadius: number;
  bgSideCharPadding: number;
  bgVerticalCharPadding: number;
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
