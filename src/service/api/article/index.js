'use strict';

const {Router} = require(`express`);

const {isArticleExists} = require(`../../middlewares/is-article-exists`);
const {isRequestDataValid} = require(`../../middlewares/is-request-data-valid`);
const {isRequestParamsValid} = require(`../../middlewares/is-request-params-valid`);
const {isArticleBelongsToUser} = require(`../../middlewares/is-article-belongs-to-user`);
const {isUserAuthorized} = require(`../../middlewares/is-user-authorized`);
const {articleDataSchema} = require(`../../schema/article-data`);
const {articleParamsSchema} = require(`../../schema/article-params`);
const {Route} = require(`./constants`);
const {HttpStatusCode} = require(`../../../constants`);

const createArticleRouter = ({articleService, commentRouter, logger}) => {
  const router = new Router();

  const isRequestDataValidMiddleware = isRequestDataValid({schema: articleDataSchema, logger});
  const isArticleExistsMiddleware = isArticleExists({service: articleService, logger});
  const isRequestParamsValidMiddleware = isRequestParamsValid({schema: articleParamsSchema, logger});
  const isUserAuthorizedMiddleware = isUserAuthorized({logger});
  const isArticleBelongsToUserMiddleware = isArticleBelongsToUser({logger, service: articleService});

  router.get(Route.INDEX, async (req, res, next) => {
    try {
      const {offset, limit} = req.query;

      const result = await articleService.findAll(offset, limit);

      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post(Route.INDEX, [isUserAuthorizedMiddleware, isRequestDataValidMiddleware], async (req, res, next) => {
    const {image, title, announce, fullText, categories} = req.body;
    const {userId} = res.locals;

    try {
      const newArticle = await articleService.create({image, title, announce, fullText, categories, userId});

      res.status(HttpStatusCode.CREATED).json(newArticle);
    } catch (error) {
      next(error);
    }
  });

  router.get(Route.ARTICLE, [isRequestParamsValidMiddleware, isArticleExistsMiddleware], async (req, res, next) => {
    const {articleId} = req.params;

    try {
      const article = await articleService.findById(articleId);

      res.status(HttpStatusCode.OK).json(article);
    } catch (error) {
      next(error);
    }
  });

  router.put(Route.ARTICLE, [
    isUserAuthorizedMiddleware,
    isRequestParamsValidMiddleware,
    isArticleExistsMiddleware,
    isArticleBelongsToUserMiddleware,
    isRequestDataValidMiddleware,
  ], async (req, res, next) => {
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

  router.delete(Route.ARTICLE, [
    isUserAuthorizedMiddleware,
    isRequestParamsValidMiddleware,
    isArticleExistsMiddleware,
    isArticleBelongsToUserMiddleware,
  ], async (req, res, next) => {
    const {articleId} = req.params;

    try {
      const deletedArticle = await articleService.delete(articleId);

      res.status(HttpStatusCode.OK).json(deletedArticle);
    } catch (error) {
      next(error);
    }
  });

  router.use(Route.COMMENTS, [isRequestParamsValidMiddleware, isArticleExistsMiddleware], commentRouter);

  return router;
};

exports.createArticleRouter = createArticleRouter;
