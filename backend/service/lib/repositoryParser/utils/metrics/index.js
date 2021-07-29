const searchLine = require("../searchLine");
const execute = require("../executeCli");

const getSumOfOccurences = (searchLineResult) =>
  Object.values(searchLineResult).reduce(
    (acc, occurences) => acc + occurences.length,
    0
  );

/**
 * Calculates average keyword position in files
 * @param {String} keyword to search
 */
async function averageKeywordPosition({ keyword, searchLineResult }) {
  const result = searchLineResult
    ? searchLineResult
    : await searchLine(keyword);
  const sumOfArrayValues = (array) => array.reduce((sum, value) => sum + value);
  const numberOfOccurences = getSumOfOccurences(result);
  if (numberOfOccurences === 0) {
    return 0;
  }
  return (
    Object.values(result).reduce(
      (acc, occurences) => acc + sumOfArrayValues(occurences),
      0
    ) / numberOfOccurences
  );
}

/**
 * Calculates average keyword inclusion rate
 * @param {String} keyword to search
 */
async function averageOccurence({ keyword, searchLineResult }) {
  const result = searchLineResult
    ? searchLineResult
    : await searchLine(keyword);
  const numberOfOccurences = getSumOfOccurences(result);
  const numberOfFiles = Object.keys(result).length;
  if (numberOfFiles === 0) {
    return 0;
  }
  return numberOfOccurences / numberOfFiles;
}

/**
 * Returns the number of files where keyword appears
 * @param {String} keyword to search
 */
async function getNumberOfFiles({ keyword, searchLineResult }) {
  const result = searchLineResult
    ? searchLineResult
    : await searchLine(keyword);
  return Object.keys(result).length;
}

const getNumberOfLinesInFile = async (filename, cwd) => {
  const result = await execute(`wc -l ${cwd}${filename}`, { cwd });
  return parseInt(result);
};

/**
 * Calculates average file size (in lines), where keyword appears
 * @param {String} keyword to search
 */
async function averageFileSize({ keyword, searchLineResult, cwd }) {
  const result = searchLineResult
    ? searchLineResult
    : await searchLine(keyword);
  const numberOfFiles = Object.keys(result).length;
  const lineNumbers = await Promise.all(
    Object.keys(result).map((filename) => getNumberOfLinesInFile(filename, cwd))
  );
  const sumOfLines = (lineNumbers) =>
    lineNumbers.reduce((acc, lineNumber) => acc + lineNumber, 0);
  if (numberOfFiles === 0) {
    return 0;
  }
  return sumOfLines(lineNumbers) / numberOfFiles;
}

module.exports = {
  averageKeywordPosition,
  averageOccurence,
  getNumberOfFiles,
  averageFileSize,
};
