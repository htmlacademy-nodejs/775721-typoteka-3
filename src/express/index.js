`use strict`;

const path = require(`path`);

const express = require(`express`);
const chalk = require(`chalk`);

const mainRouter = require(`./routes/main`);
const authenticationRouter = require(`./routes/authentication`);
const userRouter = require(`./routes/user`);
const articlesRouter = require(`./routes/articles`);
const categoriesRouter = require(`./routes/categories`);
const { DEFAULT_PORT, DirName } = require(`./constants`);
const { HttpStatusCode } = require(`../constants`);

const app = express();

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname, DirName.TEMPLATES));

app.use(express.static(path.resolve(__dirname, DirName.PUBLIC)));

app.use(mainRouter);
app.use(authenticationRouter);
app.use(`/my`, userRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, categoriesRouter);

app.use((req, res) => res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`));
app.use((error, req, res, next) => res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).render(`errors/500`));

app.listen(DEFAULT_PORT, () => console.info(chalk.green(`Принимаю подключения на ${ DEFAULT_PORT }`)))
