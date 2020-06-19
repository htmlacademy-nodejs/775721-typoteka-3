'use strict';

const express = require(`express`);
const chalk = require(`chalk`);

const {ArticleService} = require(`../data-service/article`);
const {CommentService} = require(`../data-service/comment`);
const {CategoryService} = require(`../data-service/category`);
const {getMockData} = require(`../lib/get-mock-data`);
const {createRouter} = require(`../api`);
const {HttpStatusCode} = require(`../../constants`);
const {Route, Message} = require(`./constants`);

const createServer = async ({articles} = {}) => {
  const app = express();
  let currentArticles = articles;

  if (!articles) {
    try {
      currentArticles = await getMockData();
    } catch (error) {
      console.error(chalk.red(`Ошибка при получении моковых данных. Ошибка: ${ error }`));
    }
  }

  const articleService = new ArticleService(currentArticles);
  const commentService = new CommentService();
  const categoryService = new CategoryService();

  const apiRouter = createRouter({articleService, commentService, categoryService});

  app.use(express.json());

  app.use(Route.API, apiRouter);

  app.use((req, res) => res.status(HttpStatusCode.NOT_FOUND).send(Message.NOT_FOUND));

  app.use((error, req, res, next) => res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(Message.INTERNAL_SERVER_ERROR));

  return app;
};

exports.createServer = createServer;
