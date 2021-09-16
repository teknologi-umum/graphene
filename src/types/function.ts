import type { Lang, Theme } from 'shiki';
import type { ImageFormat } from './image';

export type ScreenshotFunc = (code: string, lang: Lang | string, username: string, theme: Theme) => Promise<any>;

export type ValidateFuncOptions = {
  code: string;
  username: string;
  upscale: number;
  format: ImageFormat;
  theme: Theme;
};

export type MakeHtmlFuncOptions = {
  windowBackground: string;
  titleColor: string;
  username: string;
  highlightedCode: string;
};
