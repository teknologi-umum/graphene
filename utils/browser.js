import puppeteer from 'puppeteer-core';

export const browser = {
  get: () =>
    puppeteer.launch({
      headless: process.env?.HEADLESS ?? true,
      args: [
        '--hide-scrollbars',
        '--disable-web-security',
        // commented this out because it didn't work on my machine as well
        // see: https://github.com/puppeteer/puppeteer/issues/1837
        '--no-sandbox',
        // '--disable-setuid-sandbox',
        // '--disable-gpu',
      ],
      executablePath: process.env?.EXEC_PATH || null,
    }),
};
