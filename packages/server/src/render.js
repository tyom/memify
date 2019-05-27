import * as chrome from 'chrome-aws-lambda';
import qs from 'query-string';

let puppeteer;

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  puppeteer = require('puppeteer-core');
} else {
  puppeteer = require('puppeteer');
}

export async function renderImage(composerUrl, { format = 'jpeg', memeId, query }) {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
    defaultViewport: {
      // deviceScaleFactor: 1.2,
      // width/height ignored and taken from image dimensions
      width: 0,
      height: 0,
    },
  });

  const queryString = qs.stringify(query);
  const pageUrl = `${composerUrl}/#/${memeId}?${queryString}`;
  const page = await browser.newPage();

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  if (await page.$('.Toolbar') !== null) {
    await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      document.querySelector('.Toolbar').style.display = 'none';
    });
  }
  if (await page.$('.wf-active') !== null) {
    await page.waitForSelector('.wf-active'); // web font loaded
  }

  const image = await page.$('.Stage');
  await page.waitForSelector('.Stage.loaded');

  try {
    const file = await image.screenshot({ type: format });
    await browser.close();
    return file;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    await browser.close();
    return 'no image';
  }
}
