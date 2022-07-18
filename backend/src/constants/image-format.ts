import { lowerCasedString } from "~/schema/common";

export const IMAGE_FORMAT = ["png", "jpeg", "webp", "svg"] as const;

export type ImageFormat = typeof IMAGE_FORMAT[number];

export const imageFormatSchema = lowerCasedString
  .refine((format) => IMAGE_FORMAT.includes(format as ImageFormat))
  .default("png");
