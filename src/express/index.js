'use strict';

const path = require(`path`);

const express = require(`express`);
const chalk = require(`chalk`);
const formidableMiddleware = require(`express-formidable`);

const mainRouter = require(`./routes/main`);
const authenticationRouter = require(`./routes/authentication`);
const userRouter = require(`./routes/user`);
const articlesRouter = require(`./routes/articles`);
const categoriesRouter = require(`./routes/categories`);
const {DirName} = require(`./constants`);
const {HttpStatusCode} = require(`../constants`);
const {FRONT_SERVER_DEFAULT_PORT, UPLOAD_DIR} = require(`../config`);

const app = express();

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname, DirName.TEMPLATES));

app.use(formidableMiddleware({
  encoding: `utf-8`,
  uploadDir: UPLOAD_DIR,
  multiples: false,
}));

app.use(express.static(path.resolve(__dirname, DirName.PUBLIC)));

app.use(express.urlencoded({extended: false}));

app.use(mainRouter);
app.use(authenticationRouter);
app.use(`/my`, userRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, categoriesRouter);

app.use((req, res) => res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`));

// eslint-disable-next-line
app.use((error, req, res, next) => {
  console.error(chalk.red(`Произошла ошибка на сервере: ${ error }`));

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(FRONT_SERVER_DEFAULT_PORT, () => console.info(chalk.green(`Принимаю подключения на ${ FRONT_SERVER_DEFAULT_PORT }`)));
