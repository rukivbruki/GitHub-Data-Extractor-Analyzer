'use strict';

const moment = require('moment');

module.exports.dateCreator = {
  date1: moment('2018-01-01'),
  date2: moment('2018-02-01'),
  getDate() {
    this.date1.add(2, 'months');
    this.date2.add(2, 'months');
  },
  checkDate() {
    return (
      this.date1.format('YYYY-MM') !== moment('2020-09-01').format('YYYY-MM')
    );
  },
};

module.exports.isEmpty = (obj) => {
  for (let key in obj) {
    return true;
  }
  return false;
};
