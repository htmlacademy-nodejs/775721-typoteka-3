'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../../constants`);
const {Route} = require(`./constants`);

const createSearchRouter = (articlesService) => {
  const router = new Router();

  router.get(Route.INDEX, (req, res) => {
    const decodedQuery = decodeURI(req.query.query);

    if (!decodedQuery) {
      return res.status(HttpStatusCode.BAD_REQUEST).send(`Неверный запрос`);
    }

    const foundedArticles = articlesService.findAllByTitle(decodedQuery);

    if (!foundedArticles.length) {
      return res.status(HttpStatusCode.NOT_FOUND).send(`Не найдено публикаций содержащих: ${ decodedQuery }`);
    }

    return res.status(HttpStatusCode.OK).json(foundedArticles);
  });

  return router;
};

exports.createSearchRouter = createSearchRouter;
