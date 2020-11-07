'use strict';

const axios = require(`axios`);
require('dotenv').config();

const TIMEOUT = 15000;

// const port = process.env.API_PORT || 3000;
const defaultURL = `https://api.github.com/`;

class API {
  constructor(baseURL, timeout) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'User-Agent': 'Our script',
        Authorization: process.env.TOKEN,
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

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
