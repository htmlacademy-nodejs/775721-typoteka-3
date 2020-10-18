'use strict';

const {Router} = require(`express`);

const {isArticleExists} = require(`../../middlewares/is-article-exists`);
const {isRequestDataValid} = require(`../../middlewares/is-request-data-valid`);
const {articleDataSchema} = require(`../../schema/article-data`);
const {Route} = require(`./constants`);
const {HttpStatusCode} = require(`../../../constants`);

const createArticleRouter = ({articleService, commentRouter, logger}) => {
  const router = new Router();

  const isRequestDataValidMiddleware = isRequestDataValid({schema: articleDataSchema, logger});
  const isArticleExistsMiddleware = isArticleExists({service: articleService, logger});

  router.get(Route.INDEX, async (req, res, next) => {
    try {
      const {offset, limit} = req.query;

      const result = await articleService.findAll(offset, limit);

      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post(Route.INDEX, isRequestDataValidMiddleware, async (req, res, next) => {
    const {image, title, announce, fullText, categories} = req.body;

    try {
      const newArticle = await articleService.create({image, title, announce, fullText, categories});

      res.status(HttpStatusCode.CREATED).json(newArticle);
    } catch (error) {
      next(error);
    }
  });

  router.get(Route.ARTICLE, isArticleExistsMiddleware, async (req, res, next) => {
    const {articleId} = req.params;

    try {
      const article = await articleService.findById(articleId);

      res.status(HttpStatusCode.OK).json(article);
    } catch (error) {
      next(error);
    }
  });

  router.put(Route.ARTICLE, [isArticleExistsMiddleware, isRequestDataValidMiddleware], async (req, res, next) => {
    const {articleId} = req.params;
    const {image, title, announce, fullText, categories} = req.body;

    try {
      const updatedArticle = await articleService.update({
        id: articleId,
        image,
        title,
        announce,
        fullText,
        categories,
      });

      res.status(HttpStatusCode.OK).json(updatedArticle);
    } catch (error) {
      next(error);
    }
  });

  router.delete(Route.ARTICLE, isArticleExistsMiddleware, async (req, res, next) => {
    const {articleId} = req.params;

    try {
      const deletedArticle = await articleService.delete(articleId);

      res.status(HttpStatusCode.OK).json(deletedArticle);
    } catch (error) {
      next(error);
    }
  });

  router.use(Route.COMMENTS, isArticleExistsMiddleware, commentRouter);

  return router;
};

exports.createArticleRouter = createArticleRouter;
