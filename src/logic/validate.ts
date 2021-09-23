import { BUNDLED_LANGUAGES, BUNDLED_THEMES } from 'shiki';
import type { ValidOptions } from '../types/function';

const validateBoolean = (name: string, what: boolean, required: boolean): string => {
  if (!what && required) return `${name} is required`;
  if (what && typeof what !== 'boolean') return `${name} must be a boolean!`;
  return '';
};

const validateString = (name: string, what: string, required: boolean): string => {
  if (!what && required) return `${name} is required`;
  if (what && typeof what !== 'string') return `${name} must be a string!`;
  return '';
};

const validateNumber = (name: string, what: number, minmax: [number, number], required: boolean): string => {
  if (!what && required) return `${name} is required!`;

  if (what && typeof what !== 'number') return `${name} must be a number!`;
  if (what && what < minmax[0] && what > minmax[1])
    return `${name} can't be lower than ${minmax[0]} or bigger than ${minmax[1]}!`;

  return '';
};

const validateKeys = <T>(name: string, what: T, keys: T[], err: string, required: boolean) => {
  if (!what && required) return `${name} is required!`;

  // @ts-ignore 「Intl.ListFormat」のタイプがまだないから
  const lf = new Intl.ListFormat('en');
  if (what && !keys.includes(what)) return err ? err : `Bad \`${name}\`! Valid options are ${lf.format(keys)}`;

  return '';
};

/**
 * Validate valid options
 * @param {ValidateFuncOptions} validate
 */
export const validate = ({ code, upscale, format, theme, font, border, lang, lineNumber }: ValidOptions): string[] => {
  return [
    validateBoolean('lineNumber', lineNumber, false),
    validateString('code', code, true),
    validateNumber('upscale', upscale, [1, 10], false),
    validateNumber('border.thickness', border?.thickness, [1, Infinity], false),
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
