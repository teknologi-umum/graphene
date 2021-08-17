import sharp from 'sharp';

/**
 * Process the image using sharp
 * @param {string} base64 - Image in base64 format
 * @param {number} upscale - Upscale value
 * @param {"png" | "jpeg" | "webp"} format - The image format
 */
export const processImage = async (base64, upscale, format) => {
  const image = sharp(Buffer.from(base64, 'base64'));
  const metadata = await image.metadata();

  return image
    .resize(upscale * metadata.width, null)
    [format]()
    .toBuffer();
};
