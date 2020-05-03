`use strict`;

const version = require(`./version`);
const help = require(`./help`);
const generate = require(`./generate`);

const modules = [version, help, generate];
const Cli = modules.reduce((cliModule, module) => ({
  ...cliModule,
  [module.name]: module,
}), {});

module.exports = Cli;
