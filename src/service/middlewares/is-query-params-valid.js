'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isQueryRequestParamsValid = ({schema, logger}) => async (req, res, next) => {
  const {query} = req;

  try {
    await schema.validateAsync(query, {abortEarly: false});
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json(error);

    return logger.error(`Неверные query параметры запроса. Query параметры: ${ query }. Ошибка: ${ error }`);
  }

  return next();
};

exports.isQueryRequestParamsValid = isQueryRequestParamsValid;
