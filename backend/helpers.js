'use strict';

const moment = require('moment');
const { EventEmitter, once } = require('events');
const endProcessEmit = new EventEmitter();

module.exports.doHardWork = (resolve) => {
  setTimeout(() => {
    console.log('Сохранение данных');
    resolve('result');
  }, 2000);
};

module.exports.dateCreator = {
  test: 23,
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

module.exports.stopService = async (doHardWork) => {
  (() => Promise.all([once(endProcessEmit, 'endProcess')]))().then(() =>
    process.exit(0),
  );

  process.nextTick(() => {
    console.log('Прекращение работы приложения');
    const finishProcess = () =>
      new Promise((resolve) => {
        doHardWork(resolve);
      });
    finishProcess().then(() => endProcessEmit.emit('endProcess'));
  });

  try {
    await once(endProcessEmit, 'endProcess');
  } catch (err) {
    console.log('error happened', err);
  }
};
