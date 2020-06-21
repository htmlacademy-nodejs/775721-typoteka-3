'use strict';

const chalk = require(`chalk`);

const {MODULE_NAME, MESSAGE} = require(`./constants`);

module.exports = {
  name: MODULE_NAME,
  run() {
    console.info(chalk.gray(MESSAGE));
  }
};
