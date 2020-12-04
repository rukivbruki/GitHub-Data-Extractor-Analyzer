'use strict';

const { Router } = require(`express`);
const { Mock } = require('../../../const');
const { Platform } = require('../../../const');

const startService = (data) => {
  if (data) {
    console.log(data);
    const { Cli } = require('../../cli');
    Cli['--crawler'].run(
      ['debug'],
      Platform.WEB,
      JSON.stringify(data, null, '  '),
    );
  }
};

const createCrawlerRouter = () => {
  const router = new Router();

  router.post(`/`, (req, res, next) => {
    startService(req.body);
  });

  return router;
};

module.exports = {
  createCrawlerRouter: createCrawlerRouter,
};
