`use strict`;

const express = require(`express`);
const chalk = require(`chalk`);

const { DEFAULT_PORT } = require(`./constants`);
const mainRouter = require(`./routes/main`);
const authenticationRouter = require(`./routes/authentication`);

const app = express();

app.use(mainRouter);
app.use(authenticationRouter);

app.listen(DEFAULT_PORT, () => console.info(chalk.green(`Принимаю подключения на ${ DEFAULT_PORT }`)))
