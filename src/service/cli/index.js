`use strict`;

const modules = [];
const Cli = modules.reduce((cliModule, module) => ({
  ...cliModule,
  [module.name]: module,
}), {})

module.exports = Cli;
