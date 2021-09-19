import sharp from 'sharp';
import type { ImageFormat } from '../types/image';

/**
 * Process the image using sharp
 * @param {string} base64 - Image in base64 format
 * @param {number} upscale - Upscale value
 * @param {ImageFormat} format - The image format
 * @returns {Promise<Buffer>}
 */
export const processImage = async (base64: string, upscale: number, format: ImageFormat): Promise<Buffer> => {
  const image = sharp(Buffer.from(base64, 'base64'));
  const metadata = await image.metadata();

  return image
    .resize(upscale * (metadata.width as number), null)
    [format]()
    .toBuffer();
};
