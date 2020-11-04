'use strict';

const {Router} = require(`express`);

const {createCommentRouter} = require(`./comment`);
const {createArticleRouter} = require(`./article`);
const {createCategoryRouter} = require(`./category`);
const {createSearchRouter} = require(`./search`);
const {createUserRouter} = require(`./user`);
const {Route} = require(`./constants`);


const createRouter = ({articleService, commentService, categoryService, userService, logger}) => {
  const router = new Router();

  const commentRouter = createCommentRouter({commentService, logger});
  const articleRouter = createArticleRouter({articleService, commentRouter, logger});
  const categoryRouter = createCategoryRouter(articleService, categoryService);
  const searchRouter = createSearchRouter(articleService);
  const userRouter = createUserRouter({userService, logger});

  router.use(Route.ARTICLES, articleRouter);
  router.use(Route.CATEGORIES, categoryRouter);
  router.use(Route.SEARCH, searchRouter);
  router.use(Route.USER, userRouter);

  return router;
};

exports.createRouter = createRouter;
