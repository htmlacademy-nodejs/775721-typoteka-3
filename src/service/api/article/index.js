'use strict';

const {Router} = require(`express`);

const {isArticleExists} = require(`../../middlewares/is-article-exists`);
const {isRequestDataValid} = require(`../../middlewares/is-request-data-valid`);
const {Route, EXPECTED_PROPERTIES} = require(`./constants`);
const {HttpStatusCode} = require(`../../../constants`);

const createArticleRouter = ({articleService, commentRouter, logger}) => {
  const router = new Router();

  const isRequestDataValidMiddleware = isRequestDataValid({expectedProperties: EXPECTED_PROPERTIES, logger});
  const isArticleExistsMiddleware = isArticleExists({service: articleService, logger});

  router.get(Route.INDEX, (req, res) => {
    const articles = articleService.findAll();

    res.status(HttpStatusCode.OK).json(articles);
  });

  router.post(Route.INDEX, isRequestDataValidMiddleware, (req, res) => {
    const {title, announce, fullText, category} = req.body;

    const newArticle = articleService.create({title, announce, fullText, category});

    res.status(HttpStatusCode.CREATED).json(newArticle);
  });

  router.get(Route.ARTICLE, isArticleExistsMiddleware, (req, res) => {
    const {articleId} = req.params;

    const article = articleService.findById(articleId);

    res.status(HttpStatusCode.OK).json(article);
  });

  router.put(Route.ARTICLE, [isArticleExistsMiddleware, isRequestDataValidMiddleware], (req, res) => {
    const {articleId} = req.params;
    const {title, announce, fullText, category} = req.body;

    const updatedArticle = articleService.update({id: articleId, title, announce, fullText, category});

    res.status(HttpStatusCode.OK).json(updatedArticle);
  });

  router.delete(Route.ARTICLE, isArticleExistsMiddleware, (req, res) => {
    const {articleId} = req.params;

    const deletedArticle = articleService.delete(articleId);

    res.status(HttpStatusCode.OK).json(deletedArticle);
  });

  router.use(Route.COMMENTS, isArticleExistsMiddleware, commentRouter);

  return router;
};

exports.createArticleRouter = createArticleRouter;
