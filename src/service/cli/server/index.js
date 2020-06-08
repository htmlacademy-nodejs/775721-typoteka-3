`use strict`;

const express = require(`express`);
const chalk = require(`chalk`);

const {apiRouter} = require(`../../api`);
const {MODULE_NAME, DEFAULT_PORT, API_ROUTE, Message} = require(`./constants`);
const {HttpStatusCode} = require(`../../../constants`);

const app = express();

app.use(express.json());

app.use(API_ROUTE, apiRouter);

app.use((req, res) => res.status(HttpStatusCode.NOT_FOUND).send(Message.NOT_FOUND));

app.use((error, req, res, next) => res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(Message.INTERNAL_SERVER_ERROR));

module.exports = {
  name: MODULE_NAME,
  run(parameters) {
    const [customPort] = parameters;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => console.info(chalk.green(`Принимаю подключения на ${ port }`)));
  },
};
