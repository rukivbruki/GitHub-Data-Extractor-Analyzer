'use strict';

const pino = require('pino');
// const path = require('path');

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
  getLogger(options) {
    return logger.child({
      name: options.name,
      level: (process.env.LOG_LEVEL = options.level || `info`),
    });
  },
};
