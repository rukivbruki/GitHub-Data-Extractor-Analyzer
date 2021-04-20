'use strict';

const axios = require(`axios`);
require('dotenv').config();
const { BASE_URL, TIMEOUT } = require('./const');
console.log(process.env);

// const port = process.env.API_PORT || 3000;
class API {
  constructor(baseURL, timeout) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'User-Agent': 'Our script',
        Authorization: 'token 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',
        'Access-Control-Allow-Headers': 'x-access-token',
      },
    });
  }

  async _load(url, options) {
    return await this.instance.request({ url, ...options });
  }

  getUsers = (url) => this._load(url);
  searchCode = (item, answers) =>
    this._load(
      `/search/code?q=${answers.lib}+in:file+language:json+user:${item}`,
    );
  getRepos = (item) => this._load(item.repos_url);
}

const defaultAPI = new API(BASE_URL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
