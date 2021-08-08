import { browser } from './browser.js';
import { makeHtml } from './makeHtml.js';
import { getHighlightedCode } from './getHighlightedCode.js';

/**
 * Generate beautiful code snippet screenshot
 * @param {string} code - Raw code
 * @param {string} lang - Language
 * @param {string} username - For window title
 */
export const screenshot = async (code = '', lang = 'txt', username = '') => {
  const page = await (await browser.get()).newPage();
  await page.setContent(makeHtml(await getHighlightedCode(code, lang), username));
  await page.setViewport({ width: 1920, height: 1080 });

  await page.waitForSelector('.container');
  const container = await page.$('.container');

  const image = await container.screenshot({ encoding: 'base64' });
  await page.close();
  return image;
};
