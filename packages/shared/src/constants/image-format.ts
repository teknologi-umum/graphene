export const IMAGE_FORMATS = ["png", "jpeg", "webp", "svg"] as const;

export type ImageFormat = typeof IMAGE_FORMATS[number];
