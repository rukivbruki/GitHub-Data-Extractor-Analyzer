const searchLine = require("./utils/searchLine");
const {
    averageKeywordPosition,
    averageOccurence,
    getNumberOfFiles,
    averageFileSize
} = require('./utils/metrics');
const fs = require('fs');
const execute = require('./utils/executeCli');

class RepositoryParser {
    constructor() {
        this.filters = new Map();
    }

    addFilter(filterName, filterFunction) {
        if (this.filters.has(filterName)) {
            throw new Error('[Repository Parser] filter with this name already exists!');
        }
        this.filters.set(filterName, filterFunction);
        return this;
    }

    async execute() {
        const result = new Map();
        await Promise.all(
            [...this.filters.keys()].map(async (filterName) => {
                const filter = this.filters.get(filterName);
                result.set(filterName, await filter());
            })
        );
        return result;
    }
}

const addToData = (finalData, repositoryParserResult) => {
    const values = [...repositoryParserResult.values()];
    const isNaN = value => value !== value;
    if (values.some(value => isNaN(value) || value === 0)) {
        return
    }
    const keys = [...repositoryParserResult.keys()];
    keys.forEach(key => {
        const existingFilter = finalData.get(key);
        const newFilter = repositoryParserResult.get(key);
        if (existingFilter) {
            existingFilter.push(newFilter);
            finalData.set(key, existingFilter);
        } else {
            finalData.set(key, [newFilter]);
        }
    });
}

const stringifyMap = map => JSON.stringify(Object.fromEntries(map));

async function getUserMetrics(rootFolder) {
    const projects = (await execute(`ls -d ${rootFolder}`))
        .split("\n")
        .filter(Boolean);
    const finalData = new Map();

    for (const directory of projects) {
        const rp = new RepositoryParser();
        const searchLineResult = await searchLine('React', { cwd: directory });
        rp
            .addFilter('averageKeywordPositionForReact', () => averageKeywordPosition({ searchLineResult, cwd: directory }))
            .addFilter('averageOccurenceForReact', () => averageOccurence({ searchLineResult, cwd: directory }))
            .addFilter('numberOfFilesForReact', () => getNumberOfFiles({ searchLineResult, cwd: directory }))
            .addFilter('averageFileSizeForReact', () => averageFileSize({ searchLineResult, cwd: directory }))
        const result = await rp.execute();
        addToData(finalData, result);
    }
    console.log(finalData);
    fs.writeFile('./data.json', stringifyMap(finalData), 'utf8', console.log);
}

getUserMetrics('/Users/nikitavozisov/Public/Projects/JavaScript_Projects/*/');