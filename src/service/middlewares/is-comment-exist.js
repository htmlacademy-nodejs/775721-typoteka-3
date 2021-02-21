'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isCommentExists = ({service, logger}) => async (req, res, next) => {
  const {commentId} = req.params;

  try {
    const isNotExists = !await service.isExists(commentId);

    if (isNotExists) {
      const message = `Не могу найти комментраий с id: ${ commentId }`;

      res.status(HttpStatusCode.NOT_FOUND).send(message);

      return logger.error(message);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

module.exports.isCommentExists = isCommentExists;
