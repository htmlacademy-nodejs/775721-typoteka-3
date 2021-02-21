'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isCategoryExists = ({service, logger}) => async (req, res, next) => {
  const categoryId = req.params.categoryId || req.query.categoryId || req.body.categoryId;

  if (!categoryId) {
    return next();
  }

  const isNotExists = !await service.isExists(categoryId);

  if (isNotExists) {
    const message = `Не могу найти категорию с id: ${ categoryId }`;

    res.status(HttpStatusCode.NOT_FOUND).send(message);

    return logger.error(message);
  }

  return next();
};

exports.isCategoryExists = isCategoryExists;
