`use strict`;

const {Router} = require(`express`);

const {createCommentRouter} = require(`./comment`);
const {createArticleRouter} = require(`./article`);
const {createCategoryRouter} = require(`./category`);
const {createSearchRouter} = require(`./search`);
const {Route} = require(`./constants`);


const createRouter = ({articleService, commentService, categoryService}) => {
  const router = new Router();

  const commentRouter = createCommentRouter(articleService, commentService);
  const articleRouter = createArticleRouter(articleService, commentRouter);
  const categoryRouter = createCategoryRouter(articleService, categoryService);
  const searchRouter = createSearchRouter(articleService);

  router.use(Route.ARTICLES, articleRouter);
  router.use(Route.CATEGORIES, categoryRouter);
  router.use(Route.SEARCH, searchRouter);

  return router;
};

exports.createRouter = createRouter;
