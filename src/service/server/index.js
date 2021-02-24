'use strict';

const http = require(`http`);

const express = require(`express`);
const createSocket = require(`socket.io`);

const {pinoLogger} = require(`../logger`);
const {ArticleService} = require(`../data-service/article`);
const {CommentService} = require(`../data-service/comment`);
const {CategoryService} = require(`../data-service/category`);
const {UserService} = require(`../data-service/user`);
const {RefreshTokenService} = require(`../data-service/refresh-token`);
const {createRouter} = require(`../api`);
const {HttpStatusCode} = require(`../../constants`);
const {Route, Message} = require(`./constants`);

const createServer = ({dataBase, logger = pinoLogger} = {}) => {
  const app = express();
  const server = http.createServer(app);
  const socket = createSocket(server, {
    cors: {
      origin: `http://localhost:8080`,
    },
  });

  socket.on(`connection`, (client) => {
    const {address: ip} = client.handshake;

    logger.info(`Новое подключение к WebSocket: ${ip}`);

    client.on(`disconnect`, () => {
      logger.info(`Клиент отключён: ${ip}`);
    });
  });

  const articleService = new ArticleService(dataBase, logger);
  const commentService = new CommentService(dataBase, logger);
  const categoryService = new CategoryService(dataBase, logger);
  const userService = new UserService(dataBase, logger);
  const refreshTokenService = new RefreshTokenService(dataBase, logger);

  const apiRouter = createRouter({
    articleService,
    commentService,
    categoryService,
    userService,
    refreshTokenService,
    logger,
    socket,
  });

  app.use(express.json());

  app.use((req, res, next) => {
    const decodedUrl = decodeURI(req.url);

    logger.debug(`Старт ${ req.method } запроса к url: ${ decodedUrl }`);

    return next();
  });

  app.use((req, res, next) => {
    next();

    if (res.headersSent) {
      return logger.info(`Конец ${ req.method } запроса со статусом ${ res.statusCode }`);
    }

    return undefined;
  });

  app.use(Route.API, apiRouter);

  app.use((req, res) => {
    res.status(HttpStatusCode.NOT_FOUND).send(Message.NOT_FOUND);

    return logger.error(`Не могу найти маршрут к url: ${ req.url }.`);
  });

  app.use((error, req, res, _next) => {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(Message.INTERNAL_SERVER_ERROR);

    return logger.error(`Ошибка сервера: ${ error }.`);
  });

  return server;
};

module.exports.createServer = createServer;
