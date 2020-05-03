`use strict`;

const version = require(`./version`);
const help = require(`./help`);

const modules = [version, help];
const Cli = modules.reduce((cliModule, module) => ({
  ...cliModule,
  [module.name]: module,
}), {});

module.exports = Cli;
