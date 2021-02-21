'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isUserExists = ({service, logger}) => async (req, res, next) => {
  const {userId} = req.query;

  if (!userId) {
    return next();
  }

  try {
    const isNotExists = !await service.findById(userId);

    if (isNotExists) {
      const message = `Не могу найти пользователя с id: ${ userId }`;

      res.status(HttpStatusCode.NOT_FOUND).send(message);

      return logger.error(message);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

module.exports.isUserExists = isUserExists;
