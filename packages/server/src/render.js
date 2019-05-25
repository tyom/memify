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
  const pageUrl = `${composerUrl}/#/${preset}?${queryString}`;
  const page = await browser.newPage();

  await page.goto(pageUrl, { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    document.querySelector('.v-toolbar').style.display = 'none';
  });

  const image = await page.$('.Stage');
  if (preset.webfont) {
    await page.waitForSelector('.wf-active'); // web font loaded
  }
  const file = await image.screenshot({ type: format });
  await browser.close();
  return file;
}

module.exports = { renderImage };
