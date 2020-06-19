'use strict';

const chalk = require(`chalk`);

const {createServer} = require(`../../server`);
const {MODULE_NAME, DEFAULT_PORT} = require(`./constants`);

module.exports = {
  name: MODULE_NAME,
  async run(parameters) {
    const [customPort] = parameters;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      const server = await createServer();

      server.listen(port, () => console.info(chalk.green(`Принимаю подключения на ${ port }`)));
    } catch (error) {
      console.error(chalk.red(`Не могу создать сервер. Ошибка: ${ error }`));
    }
  },
};
