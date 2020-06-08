`use strict`;

const chalk = require(`chalk`);
const {Router} = require(`express`);

const {getMockData} = require(`../lib/get-mock-data`);
const {ArticleService} = require(`../data-service/article`);
const {createArticleRouter} = require(`./articles`);
const {Route} = require(`./constants`);

const apiRouter = new Router();

(async () => {
  try {
    const [error, mockArticles] = await getMockData();

    const articleService = new ArticleService(mockArticles);

    const articleRoute = createArticleRouter(articleService);

    apiRouter.use(Route.ARTICLES, articleRoute);
  } catch (error) {
    console.error(chalk.red(error));
  }
})();

exports.apiRouter = apiRouter;
