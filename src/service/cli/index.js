`use strict`;

const version = require(`./version`);

const modules = [version];
const Cli = modules.reduce((cliModule, module) => ({
  ...cliModule,
  [module.name]: module,
}), {})

module.exports = Cli;
