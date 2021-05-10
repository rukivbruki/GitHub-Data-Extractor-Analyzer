const crawler = require(`./crawler`);
const server = require(`./server`);

module.exports = {
  Cli: {
    [crawler.name]: crawler,
    [server.name]: server,
  },
};
