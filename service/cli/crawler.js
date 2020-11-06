'use strict';

const axios = require('axios');
const { getMenu } = require('./menu');
const { getLogger } = require(`../../logger`);
const { ExitCode } = require('../../const');
const chalkPipe = require('chalk-pipe');
const cliProgress = require('cli-progress');
const moment = require('moment');

// const logger = getLogger();
const bar1 = new cliProgress.SingleBar(
    {
        barsize: 30,
        barIncompleteChar: '.',
        format: 'progress [{bar}] | {value}/{total}',
    },
    cliProgress.Presets.legacy,
);

const logs = {
    progress: 0,
    totalRepos: null,
    currentUser: { number: null },
    names: [],
    errors: [],
    clear() {
        this.names = [];
    },
};

const warning = chalkPipe('orange.bold');
const info = chalkPipe('yellow.bold');

const isEmpty = (obj) => {
    for (let key in obj) {
        return true;
    }
    return false;
};

const instance = axios.create({
    headers: {
        'User-Agent': 'Our script',
        Authorization: `token b200dc7809f7d353df774bdda43281500fee3556`,
        'Access-Control-Allow-Headers': 'x-access-token',
    },
});

const dateCreated = {
    date1: moment('2015-01-01'),
    date2: moment('2015-02-01'),
    getDate() {
        this.date1.add(2, 'months');
        this.date2.add(2, 'months');
    },
    checkDate() {
        return this.date2.format('YYYY-MM') !== '2020-09';
    },
};

const getUserFetchUrl = (place) =>
    `https://api.github.com/search/users?q=location%3A${place}+language:javascript+created:${dateCreated.date1.format(
        'YYYY-MM',
    )}..${dateCreated.date2.format('YYYY-MM')}&per_page=100`;

async function* fetchCommits(place) {
    while (dateCreated.checkDate()) {
        console.log(getUserFetchUrl(place));
        const res = await instance.get(getUserFetchUrl(place));

        const body = await res.data;
        let nextPage = res.headers.link
            ? res.headers.link.match(/<(.*?)>; rel="next"/)
            : null;
        nextPage = nextPage && nextPage[1];
        dateCreated.getDate();

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
        const res = await instance.get(`${item.repos_url}`);

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
        await instance
            .get(
                `https://api.github.com/search/code?q=${answers.lib}+in:file+language:json+user:${item}`,
            )
            .then((res) => {
                logger.debug({
                    'Number of user': logs.names.indexOf(item),
                    'Remaining limit': res.headers['x-ratelimit-remaining'],
                    Login: item,
                });
                console.log(info(bar1.start(answers.count, logs.progress))),
                    logs.progress === answers.count ? bar1.stop() : null;
                return res;
            })
            .then((res) => {
                logs.totalRepos += res.data.total_count;
            })
            .then((logs.progress += 1))
            .catch((err) => {
                logs.errors.push(err);
                logger.error(err, `Total errors: ${logs.errors.length}`);
            });
    };

    for (const item of logs.names) {
        setTimeout(
            () =>
                getInfo(item).then(() => {
                    console.log(
                        warning(
                            `Find projects with ${answers.lib}: ${logs.totalRepos}`,
                        ),
                    );
                }),
            3000 * logs.names.indexOf(item),
        );
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
