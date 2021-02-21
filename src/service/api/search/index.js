'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../../constants`);

const createSearchRouter = (articlesService) => {
  const router = new Router();

  router.get(`/`, async (req, res, next) => {
    const decodedQuery = decodeURI(req.query.query);

    if (!decodedQuery) {
      return res.status(HttpStatusCode.BAD_REQUEST).send(`Неверный запрос`);
    }

    try {
      const foundedArticles = await articlesService.findAllByTitle(decodedQuery);

      if (!foundedArticles.length) {
        return res.status(HttpStatusCode.NOT_FOUND).send(`Не найдено публикаций содержащих: ${ decodedQuery }`);
      }

      return res.status(HttpStatusCode.OK).json(foundedArticles);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

exports.createSearchRouter = createSearchRouter;
