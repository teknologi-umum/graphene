import { BUNDLED_LANGUAGES, type Lang as Language } from "shiki";
import { lowerCasedString } from "~/schema/common";

export const LANGUAGES = BUNDLED_LANGUAGES.map((l) => l.id as Language);

export type { Language };

export const languageSchema = lowerCasedString
  .refine((language) => LANGUAGES.includes(language as Language))
  .nullable()
  .default(null);
