import type { Theme } from 'shiki';
import type { ImageFormat } from './image';

export type ValidateFuncOptions = {
  code: string;
  upscale: number;
  format: ImageFormat;
  theme: Theme;
  font: string;
};
