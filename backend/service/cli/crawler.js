'use strict';

const chalkPipe = require('chalk-pipe');
const Table = require('cli-table');
const {
  dateCreator,
  isEmpty,
  // stopService,
  // doHardWork,
} = require('../../helpers');
const { crawlerData } = require('../../data');
const api = require(`../../api`).getAPI();
const { singleBar } = require(`../../service/lib/cliProgress`);
const { getMenu } = require('./menu');
const { getLogger } = require(`../../service/lib/logger`);
// const { saveSearch, getAllSearches } = require('../database');
const warning = chalkPipe('orange.bold');
const info = chalkPipe('yellow.bold');

async function* fetchCommits(place) {
  let nextPage = null;
  while (dateCreator.checkDate()) {
    const date1 = dateCreator.date1.format('YYYY-MM');
    const date2 = dateCreator.date2.format('YYYY-MM');
    console.log(date1, date2, dateCreator.checkDate(), nextPage);
    let url =
      nextPage ||
      `search/users?q=location%3A${place}+created:${date1}..${date2}&per_page=100`;
    const res = await api.getUsers(url);
    const body = await res.data;
    nextPage = res.headers.link
      ? res.headers.link.match(/<(.*?)>; rel="next"/)
      : null;

    nextPage = nextPage && nextPage[1];
    nextPage === null ? dateCreator.getDate() : null;
    for (let item of body.items) {
      yield item;
    }
  }
}

const executor = async (answers, logger) => {
  answers = JSON.parse(answers);
  let count = 0;
  console.log(Number(answers.count));

  for await (const item of fetchCommits(answers.city)) {
    const res = await api.getRepos(item);

    isEmpty(res.data) && crawlerData.names.push(item.login);

    logger.debug(`remaining limit': ${res.headers['x-ratelimit-remaining']}`);

    if (++count === Number(answers.count)) {
      break;
    }
  }

  console.log('\n' + `Users: `, crawlerData.names);
  console.log(info('\n' + 'Total: ', crawlerData.names.length + '\n'));

  const getInfo = async (item) => {
    const printResult = () =>
      crawlerData.names.length === crawlerData.progress
        ? (() => {
            const table = new Table();
            singleBar.stop();
            table.push(
              { 'Total repos': `${crawlerData.totalRepos}` },
              { 'Amount names': `${crawlerData.names.length}` },
            );
            console.log(table.toString());
            // saveSearch(answers, crawlerData);
            setTimeout(() => process.exit(0), 1000);
          })()
        : null;
    await api
      .searchCode(item, answers)
      .then((res) => {
        logger.debug({
          'Number of user': crawlerData.names.indexOf(item),
          'Remaining limit': res.headers['x-ratelimit-remaining'],
          Login: item,
        });
        crawlerData.totalRepos += res.data.total_count;
        crawlerData.progress++;
        console.log(
          info(singleBar.start(crawlerData.names.length, crawlerData.progress)),
        );
        printResult();
      })
      .catch((err) => {
        crawlerData.progress++;
        printResult();
        crawlerData.errors.push(err);
        logger.error(err, `Number of user: ${crawlerData.names.indexOf(item)}`);
      });
  };

  for (const item of crawlerData.names) {
    setTimeout(
      () =>
        getInfo(item).then(() => {
          console.log(
            warning(
              `Find projects with ${answers.lib}: ${crawlerData.totalRepos}`,
            ),
          );
        }),
      3000 * crawlerData.names.indexOf(item),
    );
  }
};

module.exports = {
  name: `--crawler`,
  async run(args, platform, mock) {
    if (platform === 'console') {
      // setTimeout(() => stopService(doHardWork), 20000);
      const consoleLogger = getLogger({
        name: 'logger-GitHub',
        level: args[0],
      });
      getMenu(consoleLogger)(executor);
    }
    if (platform === 'web') {
      const webLogger = getLogger({ name: 'logger-api', level: args[0] });
      await executor(mock, webLogger);
    }
  },
};
