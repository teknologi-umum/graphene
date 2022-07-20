import { z } from "zod";
import { LANGUAGES, type Language } from "shared";

export const languageSchema = z
  .string({
    required_error: "language can't be empty",
    invalid_type_error: "language should be a string"
  })
  .trim()
  .transform((language) => language.toLowerCase())
  .refine((language) => LANGUAGES.includes(language as Language), {
    message: "Invalid language. Please refer to the documentation for the list of the supported language"
  })
  .optional()
  .default("auto-detect");
