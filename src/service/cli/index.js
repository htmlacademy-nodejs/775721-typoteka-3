'use strict';

const version = require(`./version`);
const help = require(`./help`);
const generate = require(`./generate`);
const server = require(`./server`);
const fill = require(`./fill`);

const modules = [version, help, generate, server, fill];
const Cli = modules.reduce((cliModule, module) => ({
  ...cliModule,
  [module.name]: module,
}), {});

module.exports = Cli;
