`use strict`;

const express = require(`express`);
const chalk = require(`chalk`);

const { DEFAULT_PORT } = require(`./constants`);

const app = express();

app.listen(DEFAULT_PORT, () => console.info(chalk.green(`Принимаю подключения на ${ DEFAULT_PORT }`)))
