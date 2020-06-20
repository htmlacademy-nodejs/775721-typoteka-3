'use strict';

const {Router} = require(`express`);

const {isArticleExists} = require(`../../middlewares/is-article-exists`);
const {isRequestDataValid} = require(`../../middlewares/is-request-data-valid`);
const {Route, EXPECTED_PROPERTIES} = require(`./constants`);
const {HttpStatusCode} = require(`../../../constants`);

const createArticleRouter = (articlesService, commentRouter) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const articles = articlesService.findAll();

    res.status(HttpStatusCode.OK).json(articles);
  });

  router.post(Route.INDEX, isRequestDataValid(EXPECTED_PROPERTIES), (req, res) => {
    const {title, announce, fullText, category} = req.body;

    const newArticle = articlesService.create({title, announce, fullText, category});

    res.status(HttpStatusCode.CREATED).json(newArticle);
  });

  router.get(Route.ARTICLE, isArticleExists(articlesService), (req, res) => {
    const {articleId} = req.params;

    const article = articlesService.findById(articleId);

    res.status(HttpStatusCode.OK).json(article);
  });

  router.put(Route.ARTICLE, [isArticleExists(articlesService), isRequestDataValid(EXPECTED_PROPERTIES)], (req, res) => {
    const {articleId} = req.params;
    const {title, announce, fullText, category} = req.body;

    const updatedArticle = articlesService.update({id: articleId, title, announce, fullText, category});

    res.status(HttpStatusCode.OK).json(updatedArticle);
  });

  router.delete(Route.ARTICLE, isArticleExists(articlesService), (req, res) => {
    const {articleId} = req.params;

    const deletedArticle = articlesService.delete(articleId);

    res.status(HttpStatusCode.OK).json(deletedArticle);
  });

  router.use(Route.COMMENTS, isArticleExists(articlesService), commentRouter);

  return router;
};

exports.createArticleRouter = createArticleRouter;
