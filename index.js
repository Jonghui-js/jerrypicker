const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
let keyword1 = '배달';
let keyword2 = '클럭';
const picker = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const adList = [];
  await page.goto('https://m.naver.com/', { waitUntil: 'networkidle2' });
  await page.goto(
    'https://m.naver.com/naverapp/?cmd=onMenu&version=3&menuCode=ENT',
    { waitUntil: 'networkidle2' }
  );
  let content = await page.evaluate(() => document.body.innerHTML);
  const $ = cheerio.load(content, { decodeEntities: true });
  const $bannerList_ent = $('div.nmap_wrapper img.banner_img');

  $bannerList_ent.each(function (i, elem) {
    adList[i] = $(this).attr('alt');
  });

  for (let i = 0; i < adList.length; i++) {
    console.log('실행');
    if (keyword1 && adList[i].includes(`${keyword1}`)) {
      await page.screenshot({
        path: `./${keyword1}.png`,
        fullPage: true,
      });
      console.log(`${keyword1}.png가 저장되었습니다.`);
      keyword1 = null;
      console.log(`keyword1의 현재 값은 ${keyword1}입니다.`);
    } else if (keyword2 && adList[i].includes(`${keyword2}`)) {
      await page.screenshot({
        path: `./${keyword2}.png`,
        fullPage: true,
      });
      console.log(`${keyword2}.png가 저장되었습니다.`);
      keyword2 = null;
      console.log(`keyword2의 현재 값은 ${keyword2}입니다.`);
    }
  }
  console.log(adList);
  await browser.close();
};

const jerry = (picker, interval = 5000) => {
  setTimeout(() => {
    console.log(`${interval / 1000}초 경과`);
    if (!keyword1 && !keyword2) return;
    picker();
    jerry(picker, interval);
  }, interval);
};

console.log(`"${keyword1}"과 "${keyword2}"에 대한 배너광고를 크롤링합니다. `);
jerry(picker);
