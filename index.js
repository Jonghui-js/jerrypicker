#!/usr/bin/env node
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const chalk = require('chalk');
const boxen = require('boxen');
const inquirer = require('inquirer');
const moment = require('moment');
const mailer = require('./config/mailer');

const greeting = chalk.greenBright.bold(
  '안녕하세요.\njerry picker는 배너광고 크롤러 CLI 프로그램으로서,\n특정 광고가 게재되었는지 일정 간격으로 확인해주고 캡쳐해줍니다.\n키워드 2가지와 원하는 간격을 입력해주세요.'
);
const infoOptions = {
  padding: 1,
  margin: 1,
  borderStyle: 'double',
  borderColor: 'green',
  backgroundColor: '',
};

const msgBox = boxen(greeting, infoOptions);

console.log(msgBox);

inquirer
  .prompt([
    {
      type: 'input',
      name: 'keyword1',
      message: chalk.black.bgCyanBright('1. 첫번째 키워드를 입력해주세요:'),
    },
    {
      type: 'input',
      name: 'keyword2',
      message: chalk.black.bgCyanBright('2. 두번째 키워드를 입력해주세요:'),
    },
    {
      type: 'input',
      name: 'interval',
      message: chalk.black.bgCyanBright(
        '3. 원하는 탐색 간격을 입력해주세요(10초 이상):'
      ),
    },
    {
      type: 'input',
      name: 'emailAddress',
      message: chalk.black.bgCyanBright(
        '4. 이미지를 어디로 보낼까요? 이메일을 적어주세요:'
      ),
    },
  ])
  .then((answers) => {
    let keyword1 = answers.keyword1;
    let keyword2 = answers.keyword2;
    let interval = answers.interval * 1000;
    let emailAddress = answers.emailAddress;
    let count = 1;

    console.log(
      '---------------------------------------------------------------------'
    );
    console.log(
      chalk.black.bgYellowBright.bold(
        `"${keyword1}", "${keyword2}"의 배너광고 크롤링을 시작합니다!`
      )
    );
    console.log(
      '---------------------------------------------------------------------'
    );

    const picker = async () => {
      const successOptions = {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'green',
        backgroundColor: '',
      };
      const key1Msg = chalk.greenBright.bold(
        `${keyword1}${moment().format(
          'YYYY-MM-DD'
        )}-${moment().hours()}h-${moment().minutes()}m.png가 바탕화면에 저장되었습니다.`
      );
      const key2Msg = chalk.greenBright.bold(
        `${keyword2}${moment().format(
          'YYYY-MM-DD'
        )}-${moment().hours()}h-${moment().minutes()}m.png가 바탕화면에 저장되었습니다.`
      );
      const key1MsgBox = boxen(key1Msg, successOptions);
      const key2MsgBox = boxen(key2Msg, successOptions);

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

      $bannerList_ent.each(function (i) {
        adList[i] = $(this).attr('alt');
      });

      for (let i = 0; i < adList.length; i++) {
        if (keyword1 && adList[i].includes(`${keyword1}`)) {
          await page.screenshot({
            path: `./${keyword1}${moment().format(
              'YYYY-MM-DD'
            )}-${moment().hours()}h-${moment().minutes()}m.png`,
            fullPage: true,
          });
          console.log(key1MsgBox);
          keyword1 = null;
        } else if (keyword2 && adList[i].includes(`${keyword2}`)) {
          await page.screenshot({
            path: `./${keyword2}${moment().format(
              'YYYY-MM-DD'
            )}-${moment().hours()}h-${moment().minutes()}m.png`,
            fullPage: true,
          });
          console.log(key2MsgBox);
          keyword2 = null;
        }
      }

      count++;
      await browser.close();
    };
    const jerry = (picker) => {
      setTimeout(() => {
        if (!keyword1 && !keyword2) {
          console.log(
            '---------------------------------------------------------------------'
          );
          console.log(
            chalk.black.bgYellowBright.bold(
              `크롤링을 성공적으로 마쳤습니다. 감사합니다.`
            )
          );
          console.log(
            '---------------------------------------------------------------------'
          );
          return;
        }
        picker();
        jerry(picker);
        console.log(chalk.blueBright(`${count}회차 크롤링이 실행중입니다.`));
      }, interval);
    };
    jerry(picker);
  });
