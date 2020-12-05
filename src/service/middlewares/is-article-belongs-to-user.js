'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isArticleBelongsToUser = ({service, logger}) => async (req, res, next) => {
  const {articleId} = req.params;
  const {userId} = res.locals;

  try {
    const isAuthorizedUserDidNotCreateThisOffer = !await service.isArticleBelongsToUser(articleId, userId);

    if (isAuthorizedUserDidNotCreateThisOffer) {
      const message = `Публикация с id ${articleId} не принадлежит авторизованному пользователю`;

      res.status(HttpStatusCode.FORBIDDEN).send(message);

      return logger.error(message);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

exports.isArticleBelongsToUser = isArticleBelongsToUser;
