const chalkPipe = require('chalk-pipe');
const Table = require('cli-table');
const {_} = require('lodash');
const moment = require('moment');

const {
    dateCreator,
    isEmpty,
    // stopService,
    // doHardWork
} = require('../../helpers');
const api = require(`../../api`).getAPI();
const {singleBar} = require(`../../service/lib/cliProgress`);
const {getMenu} = require('./menu');
const {getLogger} = require(`../../service/lib/logger`);
// const { saveSearch, getAllSearches } = require('../database');

const warning = chalkPipe('orange.bold');
const info = chalkPipe('yellow.bold');

let crawlerData = {};

async function* fetchCommits(place, id) {
    let dateObj = {
        [id]: _.cloneDeep(dateCreator),
    };
    let nextPage = null;
    console.log('ПОПАЛИ В ГЕНЕРАТОР', dateObj[id], dateCreator);
    while (dateObj[id].checkDate()) {
        const date1 = dateObj[id].date1.format('YYYY-MM');
        const date2 = dateObj[id].date2.format('YYYY-MM');
        let url =
            nextPage ||
            `search/users?q=location%3A${place}+created:${date1}..${date2}&per_page=100`;
        console.log(url);
        const res = await api.getUsers(url);
        const body = await res.data;
        nextPage = res.headers.link
            ? res.headers.link.match(/<(.*?)>; rel="next"/)
            : null;

        nextPage = nextPage && nextPage[1];
        nextPage === null ? dateObj[id].getDate() : null;
        for (let item of body.items) {
            yield item;
        }
    }
}

const executor = async (answers, logger, webFlag) => {
    answers = JSON.parse(answers);
    const DELAY = 3000;
    const startTime = moment().unix();
    console.log(startTime);
    let count = 0;
    console.log(Number(answers.count));

    crawlerData[answers.id || 'console'] = {
        progress: 0,
        totalRepos: null,
        userSearchEnd: '',
        names: [],
        errors: [],
    };

  crawlerData[answers.id || 'console'].userSearchStart = moment();

    for await (const item of fetchCommits(answers.city, answers.id)) {
        const res = await api.getRepos(item);

        isEmpty(res.data) &&
        crawlerData[answers.id || 'console'].names.push(item.login);

        logger.debug(`remaining limit': ${res.headers['x-ratelimit-remaining']}`);

        if (++count === Number(answers.count)) {
            break;
        }
    }

    logger.debug(`USER SEARCH END`);

    crawlerData[answers.id || 'console'].userSearchEnd = moment();

    console.log('\n' + `Users: `, crawlerData[answers.id || 'console'].names);
    console.log(
        info(
            '\n' + 'Total: ',
            crawlerData[answers.id || 'console'].names.length + '\n',
        ),
    );

    const getInfo = async (item) => {
        const printResult = () =>
            crawlerData[answers.id || 'console'].names.length ===
            crawlerData[answers.id || 'console'].progress
                ? (() => {
                    const table = new Table();
                    singleBar.stop();
                    table.push(
                        {
                            'User search end': `${
                                crawlerData[answers.id || 'console'].userSearchStart
                            }`,
                        },
                        {
                            'User search end': `${
                                crawlerData[answers.id || 'console'].userSearchEnd
                            }`,
                        },
                        {
                            'Total projects': `${
                                crawlerData[answers.id || 'console'].totalRepos
                            }`,
                        },
                        {
                            'Total number users': `${
                                crawlerData[answers.id || 'console'].names.length
                            }`,
                        },
                        {
                            'Total number errors': `${
                                crawlerData[answers.id || 'console'].errors.length
                            }`,
                        },
                        {'Applied delay': `${DELAY}`},
                        {'Spent time': `${moment().unix() - startTime}` / 60},
                    );
                    console.log(table.toString());
                    // saveSearch(answers, crawlerData)
                    !webFlag ? setTimeout(() => process.exit(0), 1000) : null;
                })()
                : null;
        await api
            .searchCode(item, answers)
            .then((res) => {
                logger.debug({
                    'User number': crawlerData[answers.id || 'console'].names.indexOf(
                        item,
                    ),
                    'Remaining limit': res.headers['x-ratelimit-remaining'],
                    Login: item,
                });
                crawlerData[answers.id || 'console'].totalRepos += res.data.total_count;
                crawlerData[answers.id || 'console'].progress++;
                crawlerData[answers.id || 'console'].totalTime =
                    `${moment().unix() - startTime}` / 60;
                console.log(
                    info(
                        singleBar.start(
                            crawlerData[answers.id || 'console'].names.length,
                            crawlerData[answers.id || 'console'].progress,
                        ),
                    ),
                );
                printResult();
            })
            .catch((err) => {
                crawlerData[answers.id || 'console'].progress++;
                printResult();
                crawlerData[answers.id || 'console'].errors.push(err);
                logger.error(
                    err,
                    `Number of errors: ${
                        crawlerData[answers.id || 'console'].errors.length
                    }`,
                );
            });
    };
    for (const item of crawlerData[answers.id || 'console'].names) {
        setTimeout(
            () =>
                getInfo(item).then(() => {
                    console.log(
                        warning(
                            `Find projects with ${answers.lib}: ${
                                crawlerData[answers.id || 'console'].totalRepos
                            }`,
                        ),
                    );
                }),
            DELAY * crawlerData[answers.id || 'console'].names.indexOf(item),
        );
    }
};
module.exports = {
    name: `--crawler`,
    crawlerData: crawlerData,
    async run(args, platform, clientFormData) {
        const webFlag = platform === 'web';
        if (!webFlag) {
            const consoleLogger = getLogger({
                name: 'logger-GitHub',
                level: args[0],
            });
            getMenu().then((answers) => {
                console.log(answers);
                return executor(JSON.stringify(answers, null, '  '), consoleLogger);
            });
        }
        if (webFlag) {
            const webLogger = getLogger({name: 'logger-api', level: args[0]});
            await executor(clientFormData, webLogger, webFlag);
        }
    },
};
