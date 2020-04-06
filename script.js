const s = document.getElementById('site');
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const keyword1 = document.getElementById('keyword1');
const keyword2 = document.getElementById('keyword2');
//크롤링
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const start = () => {
  musicContainer.classList.add('play');
};
const stop = () => {
  musicContainer.classList.remove('play');
};

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

// Event listeners
playBtn.addEventListener('click', async () => {
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    stop();
    return;
  } else {
    start();
  }
  const key1 = keyword1.value;
  const key2 = keyword2.value;
  console.log(key1, key2);
  const browser = await puppeteer.launch({
    executablePath: puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  await page.goto('https://m.naver.com', { waitUntil: 'networkidle2' });
  await delay(3000);
  const element = await page.$(
    '[href="/naverapp/?cmd=onMenu&version=3&menuCode=ENT"]'
  );
  console.log('dddd');
  await element.click();
  await page.screenshot({
    path: `screenshot1.png`,
    fullPage: true,
  });

  await element.screenshot({
    path: `screenshot2.png`,
    fullPage: true,
  });
  await browser.close();
  // await page.waitForSelector('iframe');

  //const elementHandle = await page.$('div#veta_top iframe');
  //const frame = await elementHandle.contentFrame();
  // console.log(elementHandle);
  //console.log(frame);
  // await page.goto(frame.url())
  //const ad = $('body .ad img').attr('alt');
  //console.log(ad);
  /*
      if (ad.match('알리익스프레스')) {
        console.log('dd');
        page.screenshot({
          path: `screenshot.png`,
          fullPage: true
        });
        console.log('저장 완료');
      }
      //await page.screenshot({ path: 'screenshot.png' });
      await browser.close();*/
});
