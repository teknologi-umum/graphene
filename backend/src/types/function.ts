import type { Theme } from 'shiki';
import type { ImageFormat } from './image';

export type ValidFont = 'jetbrains mono' | 'sf mono' | 'fira code';

export interface ValidOptions {
  code: string;
  lang: string;
  format: ImageFormat;
  upscale: number;
  border: {
    thickness: number;
    colour: string;
  };
  theme: Theme;
  font: ValidFont;
  lineNumber: boolean;
}
