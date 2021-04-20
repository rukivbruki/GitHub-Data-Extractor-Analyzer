"use strict";

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};
const BASE_URL = `http://localhost:5001/`;
const TIMEOUT = 15000;
export { HttpCode, BASE_URL, TIMEOUT };
