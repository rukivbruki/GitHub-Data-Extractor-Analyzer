'use strict';

const { Cli } = require(`./cli`);
const { ExitCode } = require(`../const`);

const DEFAULT_COMMAND = `--search`;
const USER_COMMAND_INDEX = 2;

const userInputs = process.argv.slice(USER_COMMAND_INDEX);
const [userCommand, ...commandArgs] = userInputs;

const executeCommand = async (commandName, arg) => {
    const command = Cli[commandName] || Cli[DEFAULT_COMMAND];
    const exitCode = await command.run(arg);
    if (exitCode !== ExitCode.WORKING) {
        process.exit(exitCode);
    }
};

executeCommand(userCommand, commandArgs);
