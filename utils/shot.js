import puppeteer from 'puppeteer';
import { makeHtml } from './makeHtml.js';
import { getHighlightedCode } from './getHighlightedCode.js';

/**
 * Generate beautiful code snippet screenshot
 * @param {string} code - Raw code
 * @param {string} lang - Language
 * @param {string} username - For window title
 */
export const screenshot = async (code = '', lang = 'txt', username = '') => {
  const browser = await puppeteer.launch({
    headless: process.env?.HEADLESS ?? true,
    args: ['--hide-scrollbars', '--disable-web-security'],
    userDataDir: process.env?.PROFILE_DIR ?? null,
    executablePath: process.env?.EXEC_PATH ?? null,
  });
  const page = await browser.newPage();
  await page.setContent(makeHtml(await getHighlightedCode(code, lang), username), {
    waitUntil: 'networkidle0',
  });
  await page.setViewport({ width: 1920, height: 1080 });

  await page.waitForSelector('.container');
  const container = await page.$('.container');

  const image = await container.screenshot({ encoding: 'base64' });
  await page.close();
  await browser.close();
  return image;
};
