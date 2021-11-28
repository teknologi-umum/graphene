import { BUNDLED_LANGUAGES, BUNDLED_THEMES } from 'shiki';

export interface Option {
  type: 'string' | 'number' | 'boolean' | 'keys';
  isRequired: boolean;
  min?: number;
  max?: number;
  options?: string[];
  errorMessage?: string;
}

interface ValidOptions {
  lineNumber: Option;
  code: Option;
  upscale: Option;
  radius: Option;
  border: {
    thickness: Option;
    colour: Option;
  };
  format: Option;
  lang: Option;
  theme: Option;
  font: Option;
}

export const VALID_OPTIONS: ValidOptions = {
  lineNumber: {
    type: 'boolean',
    isRequired: false,
  },
  code: {
    type: 'string',
    isRequired: true,
  },
  upscale: {
    type: 'number',
    isRequired: false,
    min: 1,
    max: 5,
  },
  radius: {
    type: 'number',
    isRequired: false,
    min: 0,
    max: Infinity,
  },
  border: {
    thickness: {
      type: 'number',
      isRequired: false,
      min: 0,
      max: Infinity,
    },
    colour: {
      type: 'string',
      isRequired: false,
    },
  },
  format: {
    type: 'keys',
    isRequired: false,
    options: ['png', 'jpeg', 'webp', 'svg'],
  },
  lang: {
    type: 'keys',
    isRequired: false,
    options: BUNDLED_LANGUAGES.map((l) => l.id),
    errorMessage: 'Bad `lang`! See https://github.com/shikijs/shiki/blob/main/docs/languages.md#all-languages',
  },
  theme: {
    type: 'keys',
    isRequired: false,
    options: BUNDLED_THEMES,
    errorMessage:
      'Bad `theme`! See https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes for list of valid themes',
  },
  font: {
    type: 'keys',
    isRequired: false,
    options: ['sf mono', 'jetbrains mono', 'fira code', 'hack', 'iosevka', 'cascadia code'],
  },
};
