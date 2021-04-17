'use strict';

const cliProgress = require('cli-progress');

module.exports.singleBar = new cliProgress.SingleBar(
  {
    barsize: 30,
    barIncompleteChar: '.',
    format: 'progress [{bar}] | {value}/{total}',
  },
  cliProgress.Presets.legacy,
);
