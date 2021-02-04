'use strict';

const {Router} = require(`express`);

const {Route} = require(`./constants`);
const {HttpStatusCode} = require(`../../../constants`);
const {categoryParamsSchema} = require(`../../schema/category-params`);
const {categoryDataSchema} = require(`../../schema/category-data`);
const {isRequestParamsValid} = require(`../../middlewares/is-request-params-valid`);
const {isRequestDataValid} = require(`../../middlewares/is-request-data-valid`);
const {isCategoryExists} = require(`../../middlewares/is-category-exists`);

const createCategoryRouter = ({categoryService, logger}) => {
  const router = new Router();

  const isRequestParamsValidMiddleware = isRequestParamsValid({schema: categoryParamsSchema, logger});
  const isCategoryDataValidMiddleware = isRequestDataValid({schema: categoryDataSchema, logger});
  const isCategoryExistsMiddleware = isCategoryExists({service: categoryService, logger});

  router.get(Route.INDEX, async (req, res, next) => {
    try {
      const categories = await categoryService.findAll();

      res.status(HttpStatusCode.OK).json(categories);
    } catch (error) {
      next(error);
    }
  });

  router.post(Route.INDEX, [isCategoryDataValidMiddleware], async (req, res, next) => {
    try {
      const newCategory = await categoryService.create(req.body);

      res.status(HttpStatusCode.CREATED).json(newCategory);
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

  router.put(Route.CATEGORY, [isRequestParamsValidMiddleware, isCategoryExistsMiddleware, isCategoryDataValidMiddleware], async (req, res, next) => {
    const {categoryId} = req.params;
    const id = Number.parseInt(categoryId, 10);

    try {
      const category = await categoryService.update({
        id,
        ...req.body,
      });

      if (!category) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(`Ошибка при обновлении категории с id: ${ categoryId }`);
      }

      return res.status(HttpStatusCode.OK).json(category);
    } catch (error) {
      return next(error);
    }
  });

  router.delete(Route.CATEGORY, [isRequestParamsValidMiddleware, isCategoryExistsMiddleware], async (req, res, next) => {
    const {categoryId} = req.params;
    const id = Number.parseInt(categoryId, 10);

    try {
      await categoryService.delete(id);

      res.sendStatus(HttpStatusCode.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

exports.createCategoryRouter = createCategoryRouter;
