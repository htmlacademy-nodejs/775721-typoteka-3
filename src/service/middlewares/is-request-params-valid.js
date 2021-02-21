'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isRequestParamsValid = ({schema, logger}) => async (req, res, next) => {
  const {params} = req;

  try {
    await schema.validateAsync(params, {abortEarly: false});
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json(error);

    return logger.error(`Неверные параметры запроса. Параметры: ${ params }. Ошибка: ${ error }`);
  }

  return next();
};

module.exports.isRequestParamsValid = isRequestParamsValid;
