import { z } from "zod";
import { IMAGE_FORMATS, type ImageFormat } from "shared";

export const imageFormatSchema = z
  .string({
    required_error: "image format can't be empty",
    invalid_type_error: "image format should be a string"
  })
  .trim()
  .transform((format) => format.toLowerCase())
  .refine((format) => IMAGE_FORMATS.includes(format as ImageFormat), {
    message: "Invalid image format. Please refer to the documentation for the list of the supported image format"
  })
  .default("png");
