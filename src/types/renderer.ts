export interface RendererOptions {
  fontFamily: string;
  fontWidth: number;
  fontSize: number;
  lineHeightToFontSizeRatio: number;
  bg: string;
  bgCornerRadius: number;
  bgSideCharPadding: number;
  bgVerticalCharPadding: number;
}

export interface SVGOutput {
  width: number;
  height: number;
  svg: string;
}
