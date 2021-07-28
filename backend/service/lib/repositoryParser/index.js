const searchLine = require("./utils/searchLine");
const {
  averageKeywordPosition,
  averageOccurence,
  getNumberOfFiles,
  averageFileSize
} = require("./utils/metrics");
const fs = require("fs");
const execute = require("./utils/executeCli");

class RepositoryParser {
  constructor() {
    this.filters = new Map();
  }
  
  addFilter(filterName, filterFunction) {
    if (this.filters.has(filterName)) {
      throw new Error(
        "[Repository Parser] filter with this name already exists!"
      );
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
    return;
  }
  const keys = [...repositoryParserResult.keys()];
  keys.forEach((key) => {
    const existingFilter = finalData.get(key);
    const newFilter = repositoryParserResult.get(key);
    if (existingFilter) {
      existingFilter.push(newFilter);
      finalData.set(key, existingFilter);
    } else {
      finalData.set(key, [newFilter]);
    }
  });
};

// it maintains the same order in which filters were added
const stringifyMap = (map, repositoryParser) => {
  const newMap = new Map();
  
  [...repositoryParser.filters.keys()].forEach((key) => {
    const value = map.get(key);
    newMap.set(key, value);
  });
  return JSON.stringify(Object.fromEntries(newMap));
};

async function getUserMetrics(rootFolder, keywords) {
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
      .addFilter(`averageKeywordPositionFor${keyword}`, () =>
        averageKeywordPosition({ searchLineResult, cwd: directory })
      )
      .addFilter(`averageOccurenceFor${keyword}`, () =>
        averageOccurence({ searchLineResult, cwd: directory })
      )
      .addFilter(`numberOfFilesForReact${keyword}`, () =>
        getNumberOfFiles({ searchLineResult, cwd: directory })
      )
      .addFilter(`averageFileSizeFor${keyword}`, () =>
        averageFileSize({ searchLineResult, cwd: directory })
      );
    }
    const result = await repoParser.execute();
    addToData(finalData, result);
  }
  console.log(finalData);
  fs.writeFile(
    "./data.json",
    stringifyMap(finalData, repoParser),
    "utf8",
    console.log
  );
}

getUserMetrics("Source/**/**/*", ["React", "className"]);
