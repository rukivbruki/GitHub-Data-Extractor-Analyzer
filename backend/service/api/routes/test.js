const { _ } = require('lodash');

let obj = {
  name: 'scotch.io',
  exec: function exec() {
    return true;
  },
};

function deepClone(obj) {
  const clObj = {};
  for (const i in obj) {
    if (obj[i] instanceof Object) {
      clObj[i] = deepClone(obj[i]);
      continue;
    }
    clObj[i] = obj[i];
  }
  return clObj;
}
