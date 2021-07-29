const execute = require("./executeCli");

const addToObject = (object, key, value) => {
  if (object[key]) {
    object[key].push(value);
  } else {
    object[key] = [value];
  }
};

const buildFolders = ["dist", "public", "build"];
const isBuildFolder = fileName => buildFolders.some(folder => fileName.startsWith(`${folder}/`));

/**
 *
 * @param {String} searchFor – string to be searched
 * @returns {Object} key - path to file, value – array of lines, where searchFor string occurs
 */

module.exports = async function searchLine(searchFor, params) {
  let result;
  try {
    result = await execute(`git grep -n -p -e '${searchFor}'`, params);
  } catch {
    return {};
  }
  const regExp1 = /.*(:)\d+(:)+/g;
  return result
    .split("\n")
    .filter(Boolean)
    .reduce((result, line) => {
      const fileName = line.slice(0, line.indexOf(":"));
      if (fileName.endsWith(".map") || isBuildFolder(fileName)) {
        return result;
      }
      const regExp1Result = line.match(regExp1);
      if (regExp1Result && regExp1Result.length > 0) {
        const [fileName, lineNumber] = regExp1Result.join("").split(":");
        addToObject(result, fileName, Number(lineNumber));
      }
      return result;
    }, {});
};
