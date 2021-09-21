import { BUNDLED_THEMES } from 'shiki';
import type { ValidateFuncOptions } from '../types/function';

/**
 * Validate valid options
 * @param {ValidateFuncOptions} validate
 */
export const validate = ({ code, upscale, format, theme, font }: ValidateFuncOptions): string[] => {
  return [
    !code && '`code` is required!',
    upscale && typeof upscale !== 'number' && '`upscale` must be a number!',
    upscale < 1 && "`upscale` can't be lower than 1!",
    format && !['png', 'jpeg', 'webp'].includes(format) && 'Bad `format`! Valid options are `png`, `jpeg`, and `webp`',
    theme &&
      !BUNDLED_THEMES.includes(theme) &&
      'Bad `theme`! See https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes for list of valid themes',
    font &&
      !['sf mono', 'jetbrains mono', 'fira code'].includes(font.toLowerCase()) &&
      'Bad `font`! Valid options are `sf mono`, `jetbrains mono`, and `fira code`',
  ].filter(Boolean) as string[];
};
