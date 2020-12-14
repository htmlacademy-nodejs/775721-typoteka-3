'use strict';

const {Router} = require(`express`);

const {Route} = require(`./constants`);
const {HttpStatusCode} = require(`../../../constants`);
const {categoryParamsSchema} = require(`../../schema/category-params`);
const {isRequestParamsValid} = require(`../../middlewares/is-request-params-valid`);

const createCategoryRouter = ({categoryService, logger}) => {
  const router = new Router();

  const isRequestParamsValidMiddleware = isRequestParamsValid({schema: categoryParamsSchema, logger});

  router.get(Route.INDEX, async (req, res, next) => {
    try {
      const categories = await categoryService.findAll();

      res.status(HttpStatusCode.OK).json(categories);
    } catch (error) {
      next(error);
    }
  });

  router.get(Route.CATEGORY, [isRequestParamsValidMiddleware], async (req, res, next) => {
    const {categoryId} = req.params;

    try {
      const category = await categoryService.findById(categoryId);

      if (!category) {
        return res.status(HttpStatusCode.NOT_FOUND).send(`Нет категории с id: ${ categoryId }`);
      }

      return res.status(HttpStatusCode.OK).json(category);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

exports.createCategoryRouter = createCategoryRouter;
