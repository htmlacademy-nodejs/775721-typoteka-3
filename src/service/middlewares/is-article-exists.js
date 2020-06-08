`use strict`;

const {HttpStatusCode} = require(`../../constants`);

const isArticleExists = (service) => (req, res, next) => {
  const {articleId} = req.params;
  const isNotExists = !service.isExists(articleId);

  if (isNotExists) {
    return res.status(HttpStatusCode.NOT_FOUND).send(`Нет публикации с id: ${articleId}`);
  }

  next();
};

exports.isArticleExists = isArticleExists;
