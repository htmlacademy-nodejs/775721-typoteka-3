'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isArticleExists = ({service, logger}) => (req, res, next) => {
  const {articleId} = req.params;
  const isNotExists = !service.isExists(articleId);

  if (isNotExists) {
    res.status(HttpStatusCode.NOT_FOUND).send(`Нет публикации с id: ${ articleId }`);

    return logger.error(`Не могу найти публикацию с id: ${ articleId }.`);
  }

  return next();
};

exports.isArticleExists = isArticleExists;
