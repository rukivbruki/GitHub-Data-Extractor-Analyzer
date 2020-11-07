'use strict';

const chalkPipe = require('chalk-pipe');
const Table = require('cli-table');

const { ExitCode } = require('../../const');
const { dateCreator, isEmpty } = require('../../helpers');
const api = require(`../../api`).getAPI();
const { singleBar } = require(`../../cliProgress`);
const { getMenu } = require('./menu');
const { getLogger } = require(`../../logger`);

const logs = {
    progress: 0,
    totalRepos: null,
    names: [],
    errors: [],
};

const warning = chalkPipe('orange.bold');
const info = chalkPipe('yellow.bold');

async function* fetchCommits(place) {
    while (dateCreator.checkDate()) {
        const date1 = dateCreator.date1.format('YYYY-MM');
        const date2 = dateCreator.date2.format('YYYY-MM');
        const res = await api.getUsers(place, date1, date2);
        const body = await res.data;
        let nextPage = res.headers.link
            ? res.headers.link.match(/<(.*?)>; rel="next"/)
            : null;
        nextPage = nextPage && nextPage[1];
        dateCreator.getDate();

        for (let item of body.items) {
            yield item;
        }
    }
}

const executor = async (answers, logger) => {
    answers = JSON.parse(answers);
    let count = 0;
    console.log(answers.count);

    for await (const item of fetchCommits(answers.city)) {
        const res = await api.getRepos(item);

        isEmpty(res.data) && logs.names.push(item.login);

        logger.debug(
            `remaining limit': ${res.headers['x-ratelimit-remaining']}`,
        );

        if (++count === answers.count) {
            break;
        }
    }

    console.log('\n' + `Users: `, logs.names);
    console.log(info('\n' + 'Total: ', logs.names.length + '\n'));

    const getInfo = async (item) => {
        const printResult = () =>
            logs.names.length === logs.progress
                ? (() => {
                      const table = new Table();
                      singleBar.stop();
                      table.push(
                          { 'Total repos': `${logs.totalRepos}` },
                          { 'Amount names': `${logs.names.length}` },
                      );
                      console.log(table.toString());
                  })()
                : null;
        await api
            .searchCode(item, answers)
            .then((res) => {
                logger.debug({
                    'Number of user': logs.names.indexOf(item),
                    'Remaining limit': res.headers['x-ratelimit-remaining'],
                    Login: item,
                });
                logs.totalRepos += res.data.total_count;
                logs.progress++;
                console.log(
                    info(singleBar.start(logs.names.length, logs.progress)),
                );
                printResult();
            })
            .catch((err) => {
                logs.progress++;
                printResult();
                logs.errors.push(err);
                logger.error(
                    err,
                    `Number of user: ${logs.names.indexOf(item)}`,
                );
            });
    };

    for (const item of logs.names) {
        setTimeout(() => getInfo(item), 200 * logs.names.indexOf(item));
    }
};

module.exports = {
    name: `--search`,
    async run(arg) {
        const logger = getLogger(arg);
        getMenu(logger)(executor);
        return ExitCode.WORKING;
    },
};
