`use strict`;

const chalk = require(`chalk`);
const {Router} = require(`express`);

const {getMockData} = require(`../lib/get-mock-data`);
const {ArticleService} = require(`../data-service/article`);
const {CommentService} = require(`../data-service/comment`);
const {CategoryService} = require(`../data-service/category`);
const {createCommentRouter} = require(`./comment`);
const {createArticleRouter} = require(`./article`);
const {createCategoryRouter} = require(`./category`);
const {createSearchRouter} = require(`./search`);
const {Route} = require(`./constants`);

const apiRouter = new Router();

(async () => {
  try {
    const [error, mockArticles] = await getMockData();

    const articleService = new ArticleService(mockArticles);
    const commentService = new CommentService();
    const categoryService = new CategoryService();

    const commentRouter = createCommentRouter(articleService, commentService);
    const articleRouter = createArticleRouter(articleService, commentRouter);
    const categoryRouter = createCategoryRouter(articleService, categoryService);
    const searchRouter = createSearchRouter(articleService);

    apiRouter.use(Route.ARTICLES, articleRouter);
    apiRouter.use(Route.CATEGORIES, categoryRouter);
    apiRouter.use(Route.SEARCH, searchRouter);
  } catch (error) {
    console.error(chalk.red(error));
  }
})();

exports.apiRouter = apiRouter;
