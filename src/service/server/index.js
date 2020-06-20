'use strict';

const express = require(`express`);

const {pinoLogger} = require(`../logger`);
const {ArticleService} = require(`../data-service/article`);
const {CommentService} = require(`../data-service/comment`);
const {CategoryService} = require(`../data-service/category`);
const {getMockData} = require(`../lib/get-mock-data`);
const {createRouter} = require(`../api`);
const {HttpStatusCode} = require(`../../constants`);
const {Route, Message} = require(`./constants`);

const createServer = async ({articles, logger = pinoLogger} = {}) => {
  const server = express();
  let currentArticles = articles;

  if (!articles) {
    try {
      currentArticles = await getMockData();
    } catch (error) {
      logger.error(`Ошибка при получении моковых данных. Ошибка: ${ error }`);
    }
  }

  const articleService = new ArticleService(currentArticles);
  const commentService = new CommentService();
  const categoryService = new CategoryService();

  const apiRouter = createRouter({articleService, commentService, categoryService});

  server.use((req, res, next) => {
    logger.debug(`Старт запроса к url: ${ req.url }`);

    return next();
  });

  server.use((req, res, next) => {
    next();

    if (res.headersSent) {
      return logger.info(`Конец запроса со статусом ${ res.statusCode }`);
    }

    return undefined;
  });

  server.use(express.json());

  server.use(Route.API, apiRouter);

  server.use((req, res) => {
    res.status(HttpStatusCode.NOT_FOUND).send(Message.NOT_FOUND);

    return logger.error(`Не могу найти маршрут к url: ${ req.url }.`);
  });

  // eslint-disable-next-line
  server.use((error, req, res, next) => {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(Message.INTERNAL_SERVER_ERROR);

    return logger.error(`Ошибка сервера: ${ error }.`);
  });

  return server;
};

exports.createServer = createServer;
