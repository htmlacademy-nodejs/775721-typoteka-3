'use strict';

const {Router} = require(`express`);

const {isArticleExists} = require(`../../middlewares/is-article-exists`);
const {isRequestDataValid} = require(`../../middlewares/is-request-data-valid`);
const {isRequestParamsValid} = require(`../../middlewares/is-request-params-valid`);
const {isUserAuthorized} = require(`../../middlewares/is-user-authorized`);
const {isAdmin} = require(`../../middlewares/is-admin`);
const {articleDataSchema} = require(`../../schema/article-data`);
const {articleParamsSchema} = require(`../../schema/article-params`);
const {HttpStatusCode} = require(`../../../constants`);
const {HOT_ARTICLES_LIMIT, LAST_COMMENTS_LIMIT} = require(`../constants`);

const createArticleRouter = ({articleService, userService, commentService, logger, socket}) => {
  const router = new Router();

  const isRequestDataValidMiddleware = isRequestDataValid({schema: articleDataSchema, logger});
  const isArticleExistsMiddleware = isArticleExists({service: articleService, logger});
  const isRequestParamsValidMiddleware = isRequestParamsValid({schema: articleParamsSchema, logger});
  const isUserAuthorizedMiddleware = isUserAuthorized({logger});
  const isAdminMiddleware = isAdmin({userService, logger});

  router.get(`/`, async (req, res, next) => {
    try {
      const {offset, limit, categoryId} = req.query;

      const result = await articleService.findAll({offset, limit, categoryId});

      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post(`/`, [isUserAuthorizedMiddleware, isAdminMiddleware, isRequestDataValidMiddleware], async (req, res, next) => {
    const {userId} = res.locals;

    try {
      const newArticle = await articleService.create({userId, ...req.body});
      const hotArticles = await articleService.findAllMostCommentedArticles({limit: HOT_ARTICLES_LIMIT});

      socket.emit(`hotArticlesUpdated`, hotArticles);

      res.status(HttpStatusCode.CREATED).json(newArticle);
    } catch (error) {
      next(error);
    }
  });

  router.get(`/most_commented`, async (req, res, next) => {
    try {
      const result = await articleService.findAllMostCommentedArticles({limit: HOT_ARTICLES_LIMIT});

      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get(`/:articleId`, [isRequestParamsValidMiddleware, isArticleExistsMiddleware], async (req, res, next) => {
    const {articleId} = req.params;

    try {
      const article = await articleService.findById(articleId);

      res.status(HttpStatusCode.OK).json(article);
    } catch (error) {
      next(error);
    }
  });

  router.put(`/:articleId`, [
    isUserAuthorizedMiddleware,
    isAdminMiddleware,
    isRequestParamsValidMiddleware,
    isArticleExistsMiddleware,
    isRequestDataValidMiddleware,
  ], async (req, res, next) => {
    const {articleId} = req.params;
    const {image, title, announce, fullText, categories, createdDate} = req.body;

    try {
      const updatedArticle = await articleService.update({
        id: articleId,
        image,
        title,
        announce,
        fullText,
        categories,
        createdDate,
      });
      const hotArticles = await articleService.findAllMostCommentedArticles({limit: HOT_ARTICLES_LIMIT});

      socket.emit(`hotArticlesUpdated`, hotArticles);

      res.status(HttpStatusCode.OK).json(updatedArticle);
    } catch (error) {
      next(error);
    }
  });

  router.delete(`/:articleId`, [
    isUserAuthorizedMiddleware,
    isAdminMiddleware,
    isRequestParamsValidMiddleware,
    isArticleExistsMiddleware,
  ], async (req, res, next) => {
    const {articleId} = req.params;

    try {
      const deletedArticle = await articleService.delete(articleId);
      const comments = await commentService.findAll({limit: LAST_COMMENTS_LIMIT});
      const hotArticles = await articleService.findAllMostCommentedArticles({limit: HOT_ARTICLES_LIMIT});

      socket.emit(`lastCommentsUpdated`, comments);
      socket.emit(`hotArticlesUpdated`, hotArticles);

      res.status(HttpStatusCode.OK).json(deletedArticle);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

module.exports.createArticleRouter = createArticleRouter;
