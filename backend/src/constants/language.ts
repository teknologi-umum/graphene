import { BUNDLED_LANGUAGES, type Lang as Language } from "shiki";
import { z } from "zod";

export const LANGUAGES = BUNDLED_LANGUAGES.map((l) => l.id as Language);

export type { Language };

export const languageSchema = z
  .string({
    required_error: "language can't be empty",
    invalid_type_error: "language should be a string"
  })
  .trim()
  .transform((language) => language.toLowerCase())
  .refine((language) => LANGUAGES.includes(language as Language))
  .nullable()
  .default(null);
