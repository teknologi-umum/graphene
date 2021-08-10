import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
import { makeHtml } from './makeHtml.js';
import { getHighlightedCode } from './getHighlightedCode.js';

/** @type {() => Promise<import("puppeteer-core").LaunchOptions>} */
const getConfig = async () => ({
  headless: chrome.headless,
  defaultViewport: chrome.defaultViewport,
  args: process.env?.EXEC_PATH
    ? [
        '--hide-scrollbars',
        '--disable-web-security',
        // commented this out because it didn't work on my machine as well
        // see: https://github.com/puppeteer/puppeteer/issues/1837
        '--no-sandbox',
        // '--disable-setuid-sandbox',
        // '--disable-gpu',
      ]
    : chrome.args,
  executablePath: process.env?.EXEC_PATH || (await chrome.executablePath),
  ignoreHTTPSErrors: true,
});

/**
 * Generate beautiful code snippet screenshot
 * @param {string} code - Raw code
 * @param {string} lang - Language
 * @param {string} username - For window title
 */
export const screenshot = async (code = '', lang = 'txt', username = '') => {
  const browser = await puppeteer.launch(await getConfig());
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(makeHtml(await getHighlightedCode(code, lang), username));

  await page.waitForSelector('.container');
  const container = await page.$('.container');

  const image = await container.screenshot({
    encoding: 'base64',
    type: 'jpeg',
    quality: 100,
  });
  await page.close();
  // await browser.close();
  return image;
};
