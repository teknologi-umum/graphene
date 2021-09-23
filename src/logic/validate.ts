import { BUNDLED_THEMES } from 'shiki';
import type { ValidateFuncOptions } from '../types/function';

type Validator = <T>(name: string, what: T) => string;
type ValidatorWithKeys = <T>(name: string, what: T, keys: T[], err?: string) => string;

const requiredString: Validator = (name, what) => (what ? '' : `${name} is required`);

const requiredNumber: Validator = (name, what) => {
  if (!what) return `${name} is required!`;
  if (typeof what !== 'number') return `${name} must be a number!`;
  if (what < 1) return `${name} can't be lower than 1!`;
  return '';
};

const requiredKeys: ValidatorWithKeys = (name, what, keys, err) => {
  // @ts-ignore 「Intl.ListFormat」がまだないから
  const lf = new Intl.ListFormat('en');
  if (!what) return `${name} is required!`;
  if (!keys.includes(what)) return err ? err : `Bad \`${name}\`! Valid options are ${lf.format(keys)}`;
  return '';
};

/**
 * Validate valid options
 * @param {ValidateFuncOptions} validate
 */
export const validate = ({ code, upscale, format, theme, font, border }: ValidateFuncOptions): string[] => {
  return [
    requiredString('code', code),
    requiredNumber('upscale', upscale),
    requiredNumber('border', border),
    requiredKeys('format', format, ['png', 'jpeg', 'webp']),
    requiredKeys(
      'theme',
      theme,
      BUNDLED_THEMES,
      'Bad `theme`! See https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes for list of valid themes',
    ),
    requiredKeys('font', font?.toLowerCase(), ['sf mono', 'jetbrains mono', 'fira code']),
  ].filter(Boolean) as string[];
};
