const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const htmlparser2 = require('htmlparser2');
// const dom = htmlparser2.parseDOM(document, options);
//const $ = cheerio.load(dom);

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://m.naver.com');
  const frame = page.frames().find(frame => frame.name() === 'da_iframe_time');
  const content = await frame.content();
  const $ = cheerio.load(content);
  const ad = $('body .ad img').attr('alt');
  const keyword = 'df'
  if (ad.match('라그나로크')) {
    await page.screenshot({ path: `screenshot${keyword}.png`, fullPage: true });
    console.log('저장 완료');
  }
  //await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
});