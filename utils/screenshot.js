import puppeteer from 'puppeteer-core';
import flourite from 'flourite';
import { makeHtml } from './makeHtml.js';
import { getHighlightedCode } from './getHighlightedCode.js';

/** @type {import("puppeteer-core").LaunchOptions} */
const config = {
  headless: process.env?.HEADLESS,
  args: [
    '--hide-scrollbars',
    '--disable-web-security',
    // commented this out because it didn't work on my machine as well
    // see: https://github.com/puppeteer/puppeteer/issues/1837
    '--no-sandbox',
    // '--disable-setuid-sandbox',
    // '--disable-gpu',
  ],
  executablePath: process.env?.EXEC_PATH,
  ignoreHTTPSErrors: true,
};

/**
 * Generate beautiful code snippet screenshot
 * @param {string} code - Raw code
 * @param {string} lang - Language
 * @param {string} username - For window title
 */
export const screenshot = async (code = '', lang, username = '') => {
  lang = lang || flourite(code).toLowerCase();
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(makeHtml(await getHighlightedCode(code, lang), username));

  await page.waitForSelector('.container');
  const container = await page.$('.container');

  const image = await container.screenshot({ encoding: 'base64' });
  await page.close();
  // await browser.close();
  return image;
};
