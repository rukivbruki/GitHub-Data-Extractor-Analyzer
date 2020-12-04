'use strict';

const { Platform } = require('../const');
const { Cli } = require(`../service/cli`);
const { ExitCode } = require(`../const`);

const DEFAULT_COMMAND = `--help`;
const USER_COMMAND_INDEX = 2;

const userInputs = process.argv.slice(USER_COMMAND_INDEX);
const [commandName, ...commandArgs] = userInputs;

const executeCommand = async () => {
  if (userInputs.length === 0 || !Cli[commandName]) {
    Cli[DEFAULT_COMMAND].run();
    process.exit(ExitCode.success);
  }
  Cli[commandName].run(commandArgs, Platform.CONSOLE);
};

executeCommand(commandName, commandArgs);
