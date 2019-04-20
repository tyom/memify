const chrome = require('chrome-aws-lambda');
const qs = require('query-string');
let puppeteer;

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  puppeteer = require('puppeteer-core');
} else {
  puppeteer = require('puppeteer');
}

async function renderImage(composerUrl, { format = 'jpeg', preset, ...query }) {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
    defaultViewport: {
      deviceScaleFactor: 1.2,
      // width/height ignored and taken from image dimensions
      width: 0,
      height: 0,
    },
  });

  const queryString = qs.stringify(query);
  const pageUrl = `${composerUrl}#/${preset}?${queryString}`;
  const page = await browser.newPage();

  const response = await page.goto(pageUrl);

  // Wait for custom fonts to load (in dev only)
  if (!isProd) {
    await page.setContent((await response.buffer()).toString('utf8'));
    await page.evaluateHandle('document.fonts.ready');
  }

  const image = await page.$('.Composer');
  const file = await image.screenshot({ type: format });
  await browser.close();
  return file;
}

module.exports = { renderImage };
