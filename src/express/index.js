`use strict`;

const express = require(`express`);
const chalk = require(`chalk`);

const { DEFAULT_PORT } = require(`./constants`);
const mainRouter = require(`./routes/main`);

const app = express();

app.use(mainRouter);

app.listen(DEFAULT_PORT, () => console.info(chalk.green(`Принимаю подключения на ${ DEFAULT_PORT }`)))
