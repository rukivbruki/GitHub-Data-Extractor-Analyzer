"use strict";

module.exports = {
  ExitCode: {
    SUCCESS: 0,
    ERROR: 1,
    WORKING: 2,
  },
  //ConnectionLink: "mongodb://127.0.0.1:27017/search"
  ConnectionLink: "mongodb://mongodb:27017/search",
};
module.exports.USER_ARGV_INDEX = 2;
module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};
module.exports.TIMEOUT = 15000;
module.exports.BASE_URL = `https://api.github.com/`;
module.exports.API_PREFIX = `/api`;
module.exports.Platform = { WEB: `web`, CONSOLE: `console` };
module.exports.Mock = {
  city: "saint-petersburg",
  lib: "react",
  count: 2,
};
