import { ImagePool } from '@squoosh/lib';

/**
 * Process the image using libsquoosh
 * @param {string} base64 - Image in base64 format
 * @param {number} upscale - Upscale value
 * @param {"oxipng" | "mozjpeg"} format - The image format
 */
export const squooshify = async (base64, upscale, format) => {
  const pool = new ImagePool();
  const image = pool.ingestImage(Buffer.from(base64, 'base64'));

  const metadata = await image.decoded;

  await image.preprocess({
    resize: {
      enabled: true,
      width: metadata.bitmap.width * upscale,
    },
  });
  await image.encode({
    mozjpeg: {},
    oxipng: {},
  });

  await pool.close();

  return Buffer.from((await image.encodedWith[format === 'png' ? 'oxipng' : 'mozjpeg']).binary, 'binary');
};
