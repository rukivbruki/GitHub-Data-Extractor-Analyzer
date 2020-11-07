'use strict';

const axios = require(`axios`);

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
                Authorization: `token 90aaa4357287abe5a705e55ce59bb5720dc8f1e6`,
                'Access-Control-Allow-Headers': 'x-access-token',
            },
        });
    }

    async _load(url, options) {
        return await this.instance.request({ url, ...options });
    }

    getUsers = (place, date1, date2) =>
        this._load(
            `search/users?q=location%3A${place}+language:javascript+created:${date1}..${date2}&per_page=100`,
        );
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
