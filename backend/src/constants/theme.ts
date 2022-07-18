import { BUNDLED_THEMES, type Theme } from "shiki";
import { lowerCasedString } from "~/schema/common";

export const THEMES = BUNDLED_THEMES;

export type { Theme };

export const themeSchema = lowerCasedString
  .transform((language) => language.toLowerCase())
  .refine((theme) => THEMES.includes(theme as Theme))
  .default("github-dark");
