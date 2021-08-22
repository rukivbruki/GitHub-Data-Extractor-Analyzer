const searchLine = require("./utils/searchLine");
const {
    averageKeywordPosition,
    averageOccurence,
    getNumberOfFiles,
    averageFileSize
} = require('./utils/metrics');
const fs = require('fs');
const execute = require('./utils/executeCli');
const RepositoryParser = require('./repositoryParser');

const addToData = (finalData, repositoryParserResult) => {
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

// it maintains the same order in which filters were added
const stringifyMap = (map, repositoryParser) => {
    const newMap = new Map();

    [...repositoryParser.filters.keys()].forEach(key => {
        const value = map.get(key);
        newMap.set(key, value);
    });
    return JSON.stringify(Object.fromEntries(newMap));
}

const getUserMetricsParams = {
    folder: '/Users/nikitavozisov/Public/Projects/JavaScript_Projects/GitHub-API-research-tool/backend/service/lib/repositoryParser/Source/*/',
    keywords: [
        'React',
        'className',
        'useState',
        'useEffect',
        'propTypes',
        'render',
        'shallow',
        'describe',
        'beforeEach',
        'afterEach',
        'createStore',
        'applyMiddleware',
        'mapStateToProps'
    ]
}

class ProjectsAnalyzer {
    constructor() {
        this.data = new Map();
    }

    async analyzeByLinks(folderToDownloadTo, repoLinks) {
        await Promise.all(
            repoLinks.map(link => execute(`git clone ${link}`, { cwd: folderToDownloadTo }))
        );
        await this.analyzeByPath(`${folderToDownloadTo}/*/`, getUserMetricsParams.keywords);
    }

    async analyzeByPath(rootFolder, keywords) {
        const projects = (await execute(`ls -d ${rootFolder}`))
            .split("\n")
            .filter(Boolean);
        const finalData = new Map();
        let repoParser;
        for (const directory of projects) {
            repoParser = new RepositoryParser();
            for (const keyword of keywords) {
                const searchLineResult = await searchLine(keyword, { cwd: directory });
                repoParser
                    .addFilter(`average-keyword-position-for-${keyword}`, () => averageKeywordPosition({ searchLineResult, cwd: directory }))
                    .addFilter(`average-occurrence-for-${keyword}`, () => averageOccurence({ searchLineResult, cwd: directory }))
                    .addFilter(`number-of-files-for-${keyword}`, () => getNumberOfFiles({ searchLineResult, cwd: directory }))
                    .addFilter(`average-file-size-for-${keyword}`, () => averageFileSize({ searchLineResult, cwd: directory }))
            }
            const result = await repoParser.execute();
            addToData(finalData, result);
        }
        console.log(finalData);
        fs.writeFile('./data.json', stringifyMap(finalData, repoParser), 'utf8', console.log);
    }
}

const pa = new ProjectsAnalyzer();

// pa.analyzeByLinks('/Users/nikitavozisov/Public/Projects/JavaScript_Projects/GitHub-API-research-tool/backend/service/lib/repositoryParser/repos', [
//     'https://github.com/Nitvex/itmo-js-course',
//     'https://github.com/Nitvex/react-app'
// ]);

pa.analyzeByPath(getUserMetricsParams.folder, getUserMetricsParams.keywords);