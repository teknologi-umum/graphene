import z from "zod";
import { themeSchema, languageSchema, imageFormatSchema, fontSchema } from "~/constants";

export const optionSchema = z.object({
  code: z.string().trim(),
  language: languageSchema,
  theme: themeSchema,
  imageFormat: imageFormatSchema,
  font: fontSchema,
  upscale: z.number().min(1).max(5).default(1),
  usingLineNumber: z.boolean().default(true),
  border: z.object({
    colour: z
      .string()
      .refine((colour) => new RegExp("#[0-9a-f]{6}", "i").test(colour), {
        message: "border.colour must be in a valid HEX format"
      })
      .default("#2E3440"),
    thickness: z.number().min(0).default(0),
    radius: z.number().min(0).default(0)
  })
});

export type OptionSchema = z.infer<typeof optionSchema>;
