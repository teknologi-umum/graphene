import z from "zod";
import { themeSchema } from "./theme.js";
import { languageSchema } from "./language.js";
import { imageFormatSchema } from "./image-format.js";
import { fontSchema } from "./font.js";
import { borderSchema } from "./border.js";
import { upscaleSchema } from "./upscale.js";

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
  upscale: upscaleSchema,
  showLineNumber: z
    .boolean({
      invalid_type_error: "showLineNumber should be a boolean"
    })
    .default(true),
  border: borderSchema
});

export type OptionSchema = z.infer<typeof optionSchema>;
