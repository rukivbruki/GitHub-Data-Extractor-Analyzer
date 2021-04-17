'use strict';

const inquirer = require('inquirer');
const questions = [
  {
    type: 'input',
    name: 'city',
    message: 'В каком городе будем искать?',
    default: function () {
      return 'saint-petersburg';
    },
  },
  {
    type: 'input',
    name: 'lib',
    message: 'Какую библиотеку?',
    default: function () {
      return 'react';
    },
  },
  {
    type: 'list',
    name: 'count',
    message: 'Сколько пользователей обойдем?',
    choices: [
      2,
      10,
      30,
      50,
      110,
      500,
      2095,
      'Искать по всем репозиториям',
      new inquirer.Separator(),
      'Узнать больше о приложении',
    ],
  },
];

module.exports = {
  getMenu(logger) {
    return (executor) => {
      inquirer.prompt(questions).then((answers) => {
        console.log(answers);
        return executor(JSON.stringify(answers, null, '  '), logger);
      });
    };
  },
};
