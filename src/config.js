'use strict';

const dotenv = require(`dotenv`);

const {ExitCode} = require(`./constants`);

const {error, parsed} = dotenv.config();

if (error) {
  console.error(`Не могу получить переменные окружения. Ошибка: ${ error }`);

  process.exit(ExitCode.ERROR);
}

module.exports = {
  ...parsed,
};
