'use strict';

const { Router } = require(`express`);
const { createCrawlerRouter } = require(`./crawler-routes`);
const { testRouter } = require(`./test-routes`);

const createRoutes = () => {
  const router = new Router();

  router.use(`/crawler`, createCrawlerRouter());
  router.use(`/test`, testRouter());

  return router;
};

module.exports = {
  createRoutes,
};
