const chrome = require('chrome-aws-lambda');
const qs = require('query-string');
let puppeteer;

if (process.env.NODE_ENV === 'production') {
  puppeteer = require('puppeteer-core');
} else {
  puppeteer = require('puppeteer');
}

async function renderImage(composerUrl, { format = 'jpeg', ...query }) {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
    // defaultViewport: {
    //   width: 800,
    //   height: 400,
    //   deviceScaleFactor: 2,
    // },
  });

  const queryString = qs.stringify(query);
  const pageUrl = `${composerUrl}#?${queryString}`;
  const page = await browser.newPage();

  await page.goto(pageUrl);

  const image = await page.$('.Composer');
  const file = await image.screenshot({ type: format });
  await browser.close();
  return file;
}

module.exports = { renderImage };
