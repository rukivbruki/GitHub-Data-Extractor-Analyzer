'use strict';

const pino = require('pino');
const path = require('path');

let n = 0;
// const logFile = path.resolve(__dirname, `logs`);

const logger = pino(
    {
        prettyPrint: {
            translateTime: true,
            levelFirst: true,
        },
        mixin() {
            return { line: ++n };
        },
    },
    // logFile,
);

module.exports = {
    logger,
    getLogger(levels) {
        return logger.child({
            name: `github-crawler`,
            level: (process.env.LOG_LEVEL = levels[0] || `info`),
        });
    },
};
