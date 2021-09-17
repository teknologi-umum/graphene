import { BUNDLED_THEMES } from 'shiki';
import type { ValidateFuncOptions } from '../types/function';

/**
 * Validate valid options
 * @param {Object}
 */
export const validate = ({ code, upscale, format, theme }: ValidateFuncOptions): Array<string> => {
  return [
    !code && '`code` is required!',
    upscale && typeof upscale !== 'number' && '`upscale` must be a number!',
    upscale < 1 && "`upscale` can't be lower than 1!",
    format && !['png', 'jpeg', 'webp'].includes(format) && 'Bad `format`! Valid options are `png`, `jpeg`, and `webp`',
    theme &&
      !BUNDLED_THEMES.includes(theme) &&
      'Bad `theme`! See https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes for list of valid themes',
  ].filter(Boolean);
};
