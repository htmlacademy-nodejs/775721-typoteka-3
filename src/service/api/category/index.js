'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../../constants`);
const {Route} = require(`./constants`);

const createCategoryRouter = (articleService, categoryService) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const articles = articleService.findAll();
    const categories = categoryService.findAll(articles);

    res.status(HttpStatusCode.OK).json(categories);
  });

  return router;
};

exports.createCategoryRouter = createCategoryRouter;
