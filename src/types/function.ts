import type { Theme } from 'shiki';
import type { ImageFormat } from './image';

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
  font: 'jetbrains mono' | 'sf mono' | 'fira code';
  lineNr: boolean;
}
