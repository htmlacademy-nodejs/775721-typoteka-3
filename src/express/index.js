'use strict';

const path = require(`path`);
const fs = require(`fs`).promises;
const fsConstants = require(`fs`).constants;

const express = require(`express`);
const chalk = require(`chalk`);
const formidableMiddleware = require(`express-formidable`);
const cookieParser = require(`cookie-parser`);
const csrf = require(`csurf`);

const mainRouter = require(`./routes/main`);
const authenticationRouter = require(`./routes/authentication`);
const userRouter = require(`./routes/user`);
const articlesRouter = require(`./routes/articles`);
const categoriesRouter = require(`./routes/categories`);
const {DirName, AUTHORIZATION_KEY} = require(`./constants`);
const {HttpStatusCode, UserRole} = require(`../constants`);
const {FRONT_SERVER_DEFAULT_PORT, UPLOAD_DIR, API_SERVER_URL} = require(`../config`);
const {request} = require(`./request`);
const {isAdmin} = require(`./middlewares/is-admin`);

const app = express();
const csrfProtection = csrf({cookie: true});

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname, DirName.TEMPLATES));

app.use(async (req, res, next) => {
  try {
    await fs.access(UPLOAD_DIR, fsConstants.F_OK);
  } catch (error) {
    await fs.mkdir(UPLOAD_DIR);
  }

  next();
});

app.use(formidableMiddleware({
  encoding: `utf-8`,
  uploadDir: UPLOAD_DIR,
  multiples: false,
}));

app.use(express.static(path.resolve(__dirname, DirName.PUBLIC)));

app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use(async (req, res, next) => {
  const authorization = req.cookies[AUTHORIZATION_KEY];

  if (authorization) {
    const [,, refreshToken] = authorization.split(` `);

    const {statusCode, body} = await request.post({url: `${ API_SERVER_URL }/user/refresh`, json: true, body: {token: refreshToken}});

    if (statusCode === HttpStatusCode.OK) {
      const {accessToken, refreshToken: newRefreshToken, user} = body;
      const authorizationValue = `Bearer ${accessToken} ${newRefreshToken}`;
      const isRoleAdmin = user.role === UserRole.ADMIN;

      res.cookie(AUTHORIZATION_KEY, authorizationValue, {httpOnly: true, sameSite: `strict`});
      res.locals = {
        ...res.locals,
        isAuthorized: true,
        isAdmin: isRoleAdmin,
        user,
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
        },
        headers: {
          [AUTHORIZATION_KEY]: authorizationValue,
        },
      };
    }
  }

  next();
});

app.use((req, res, next) => {
  res.locals.currentPath = req.originalUrl;

  next();
});

app.use(mainRouter);
app.use(authenticationRouter);
app.use(`/my`, [isAdmin], userRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, [isAdmin], categoriesRouter);

app.use((req, res) => res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`));

app.use((error, req, res, _next) => {
  console.error(chalk.red(`Произошла ошибка на сервере: ${ error }`));

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(FRONT_SERVER_DEFAULT_PORT, () => console.info(chalk.green(`Принимаю подключения на ${ FRONT_SERVER_DEFAULT_PORT }`)));
