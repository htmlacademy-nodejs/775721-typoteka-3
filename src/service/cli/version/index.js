`use strict`;

const chalk = require(`chalk`);

const packageJson = require(`../../../../package.json`);
const { MODULE_NAME } = require(`./constants`);

module.exports = {
  name: MODULE_NAME,
  run() {
    const { version } = packageJson;

    console.info(chalk.blue(version));
  }
}
