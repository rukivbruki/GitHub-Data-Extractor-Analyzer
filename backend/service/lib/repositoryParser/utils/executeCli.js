const exec = require("child_process").exec;

module.exports = async function execute(command, params = {}) {
  return new Promise((resolve, reject) => {
    exec(command, params, function (error, stdout, stderr) {
      if (error) {
        reject(error);
      }
      resolve(stdout);
    });
  });
};
