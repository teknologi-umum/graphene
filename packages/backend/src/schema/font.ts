import { z } from "zod";
import { FONTS, type Font } from "shared";

export const fontSchema = z
  .string({
    required_error: "font can't be empty",
    invalid_type_error: "font should be a string"
  })
  .trim()
  .transform((font) => font.toLowerCase())
  .refine((font) => FONTS.includes(font as Font), {
    message: "Invalid font. Please refer to the documentation for the list of the supported font"
  })
  .default("sf mono");
