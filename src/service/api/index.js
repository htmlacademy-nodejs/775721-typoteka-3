'use strict';

const {Router} = require(`express`);

const {createArticleRouter} = require(`./article`);
const {createCategoryRouter} = require(`./category`);
const {createSearchRouter} = require(`./search`);
const {createUserRouter} = require(`./user`);
const {createCommentRouter} = require(`./comment`);
const {Route} = require(`./constants`);


const createRouter = ({articleService, commentService, categoryService, userService, refreshTokenService, logger}) => {
  const router = new Router();

  const articleRouter = createArticleRouter({articleService, userService, logger});
  const categoryRouter = createCategoryRouter({categoryService, userService, logger});
  const searchRouter = createSearchRouter(articleService);
  const userRouter = createUserRouter({userService, refreshTokenService, logger});
  const commentRouter = createCommentRouter({commentService, articleService, userService, logger});

  router.use(Route.ARTICLES, articleRouter);
  router.use(Route.CATEGORIES, categoryRouter);
  router.use(Route.SEARCH, searchRouter);
  router.use(Route.USER, userRouter);
  router.use(Route.COMMENTS, commentRouter);

  return router;
};

exports.createRouter = createRouter;
