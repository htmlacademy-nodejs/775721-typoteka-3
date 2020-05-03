`use strict`;

const Cli = require(`./cli`);
const { USER_ARGUMENTS_START_INDEX } = require(`./constants`);

const userArguments = process.argv.slice(USER_ARGUMENTS_START_INDEX);
const [command, ...parameters] = userArguments;
const calledModule = Cli[command];

if (!calledModule) {
  process.exit();
}

calledModule.run(parameters);



