import { z } from "zod";

export const IMAGE_FORMAT = ["png", "jpeg", "webp", "svg"] as const;

export type ImageFormat = typeof IMAGE_FORMAT[number];

export const imageFormatSchema = z
  .string({
    required_error: "image format can't be empty",
    invalid_type_error: "image format should be a string"
  })
  .trim()
  .transform((format) => format.toLowerCase())
  .refine((format) => IMAGE_FORMAT.includes(format as ImageFormat), {
    message: "Invalid image format. Please refer to the documentation for the list of the supported image format"
  })
  .default("png");
