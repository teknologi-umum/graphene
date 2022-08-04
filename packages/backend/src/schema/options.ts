import z from "zod";
import { themeSchema } from "./theme";
import { languageSchema } from "./language";
import { imageFormatSchema } from "./image-format";
import { fontSchema } from "./font";
import { borderSchema } from "./border";
import { upscaleSchema } from "./upscale";

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
