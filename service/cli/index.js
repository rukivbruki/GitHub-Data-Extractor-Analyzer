'use strict';

const crawler = require(`./crawler`);

module.exports = {
  Cli: {
    [crawler.name]: crawler,
  },
};
