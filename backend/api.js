'use strict';

const axios = require(`axios`);
require('dotenv').config();
const { BASE_URL, TIMEOUT } = require('./const');

// const port = process.env.API_PORT || 3000;

const headers = {
  'content-type': 'application/json',
  'User-Agent': 'Our script',
  Authorization: 'token 9b6be655889bd8cb405a3cb1f0706a51ce1da49d',
  'Access-Control-Allow-Headers': 'x-access-token',
};

class API {
  constructor(baseURL, timeout, headers) {
    this.instance = axios.create({ baseURL, timeout, headers });
  }

  async _load(url, options) {
    return await this.instance.request({ url, ...options });
  }

  async _post(url, data) {
    return await this.instance.post(url, data);
  }

  postQuery = (url, data) => this._post(url, data);
  getUsers = (url) => this._load(url);
  searchCode = (item, answers) =>
    this._load(
      `/search/code?q=${answers.lib}+in:file+language:json+user:${item}`,
    );
  getRepos = (item) => this._load(item.repos_url);
}

const defaultAPI = new API(BASE_URL, TIMEOUT, headers);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
