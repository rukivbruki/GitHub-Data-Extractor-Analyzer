const { Router } = require(`express`);

const longTermFunction = () => String(Math.random());

const testRouter = () => {
  const router = new Router();

  router.get(`/`, (req, res, next) => {
    setTimeout(() => res.send(longTermFunction()), 10000);
  });

  return router;
};

module.exports = {
  testRouter: testRouter,
};
