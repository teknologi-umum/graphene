import * as yup from 'yup';
import { BUNDLED_LANGUAGES, BUNDLED_THEMES as validThemes, Lang, Theme } from 'shiki';

export const validLanguages = BUNDLED_LANGUAGES.map((l) => l.id);
export const validFormat = ['png', 'jpeg', 'webp', 'svg'] as const;
export const validFonts = ['sf mono', 'jetbrains mono', 'fira code', 'hack', 'iosevka', 'cascadia code'] as const;

export type ValidLanguages = Lang;
export type ValidThemes = Theme;
export type ValidFormats = typeof validFormat[number];
export type ValidFonts = typeof validFonts[number];

export const optionSchema = yup.object({
  code: yup.string().required(),
  lang: yup.string().lowercase().oneOf(validLanguages).ensure(),
  theme: yup.string().lowercase().oneOf(validThemes).default('github-dark'),
  format: yup
    .string()
    .lowercase()
    .oneOf([...validFormat])
    .default('png'),
  font: yup
    .string()
    .lowercase()
    .oneOf([...validFonts])
    .default('sf mono'),
  upscale: yup.number().min(1).max(5).default(1),
  lineNumber: yup.boolean().default(true),
  border: yup.object({
    colour: yup
      .string()
      .matches(/#[0-9a-f]{6}/i, 'colour must be in a valid hex format')
      .default('#2E3440'),
    thickness: yup.number().positive().default(0),
    radius: yup.number().positive().default(0),
  }),
});

export interface OptionSchema extends yup.InferType<typeof optionSchema> {
  format: ValidFormats;
  font: ValidFonts;
  lang: ValidLanguages;
  theme: ValidThemes;
}
