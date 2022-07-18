import z from "zod";
import { themeSchema, languageSchema, imageFormatSchema, fontSchema } from "~/constants";

const defaultBorder = "#2E3440";

export const optionSchema = z.object({
  code: z
    .string({
      required_error: "code can't be empty",
      invalid_type_error: "code should be a string"
    })
    .trim(),
  language: languageSchema,
  theme: themeSchema,
  imageFormat: imageFormatSchema,
  font: fontSchema,
  upscale: z
    .number()
    .min(1, { message: "upscale value can't be lower than 1" })
    .max(5, { message: "upscale value can't be greater than 5" })
    .default(1),
  showLineNumber: z
    .boolean({
      invalid_type_error: "showLineNumber should be a boolean"
    })
    .default(true),
  border: z
    .object({
      colour: z
        .string({
          invalid_type_error: "border.colour should be a string"
        })
        .refine((colour) => new RegExp("#[0-9a-f]{6}", "i").test(colour), {
          message: "border.colour must be in a valid HEX format"
        })
        .default(defaultBorder),
      thickness: z
        .number()
        .min(0, {
          message: "border.thickness can't be lower than 0"
        })
        .default(0),
      radius: z
        .number()
        .min(0, {
          message: "border.radius can't be lower than 0"
        })
        .default(0)
    })
    .default({})
});

export type OptionSchema = z.infer<typeof optionSchema>;
