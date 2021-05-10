"use strict";

const { Router } = require(`express`);
const { createCrawlerRouter } = require(`./crawler-routes`);

const createRoutes = () => {
  const router = new Router();

  router.use(`/crawler`, createCrawlerRouter());

  return router;
};

module.exports = {
  createRoutes,
};
