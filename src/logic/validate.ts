import { BUNDLED_LANGUAGES, BUNDLED_THEMES } from 'shiki';
import type { ValidOptions } from '../types/function';

const validateBoolean = (name: string, bool: boolean): string => {
  if (bool !== undefined && bool !== null && typeof bool !== 'boolean') return `\`${name}\` must be a boolean!`;
  return '';
};

const validateString = (name: string, str: string, required: boolean): string => {
  if (!str && required) return `\`${name}\` is required!`;
  if (str && typeof str !== 'string') return `${name} must be a string!`;
  return '';
};

const validateNumber = (name: string, num: number, max: number, required: boolean): string => {
  if (!num && required) return `\`${name}\` is required!`;

  if (num === 0 || num) {
    if (typeof num !== 'number') return `\`${name}\` must be a number!`;
    if (!(num >= 1 && num <= max)) return `\`${name}\` can't be lower than ${1} or higher than ${max}!`;
  }

  return '';
};

const validateKeys = <T>(name: string, key: T, keys: T[], err: string, required: boolean) => {
  if (!key && required) return `${name} is required!`;

  // @ts-ignore 「Intl.ListFormat」のタイプがまだないから
  const lf = new Intl.ListFormat('en');
  if (key && !keys.includes(key))
    return err ? err : `Bad \`${name}\`! Valid options are ${lf.format(keys.map((x) => `\`${x}\``))}`;

  return '';
};

/**
 * Validate valid options
 * @param {ValidateFuncOptions} validate
 */
export const validate = ({ code, upscale, format, theme, font, border, lang, lineNumber }: ValidOptions): string[] => {
  return [
    validateBoolean('lineNumber', lineNumber),
    validateString('code', code, true),
    validateNumber('upscale', upscale, 10, false),
    validateNumber('border.thickness', border?.thickness, Infinity, false),
    validateString('border.colour', border?.colour, false),
    validateKeys('format', format, ['png', 'jpeg', 'webp'], '', false),
    validateKeys(
      'lang',
      lang,
      BUNDLED_LANGUAGES.map((l) => l.id),
      'Bad `lang`! See https://github.com/shikijs/shiki/blob/main/docs/languages.md#all-languages',
      false,
    ),
    validateKeys(
      'theme',
      theme,
      BUNDLED_THEMES,
      'Bad `theme`! See https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes for list of valid themes',
      false,
    ),
    validateKeys('font', (font ?? '').toLowerCase(), ['sf mono', 'jetbrains mono', 'fira code'], '', false),
  ].filter(Boolean) as string[];
};
