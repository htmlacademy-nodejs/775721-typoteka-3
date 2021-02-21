'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isRequestDataValid = ({schema, logger}) => async (req, res, next) => {
  const {body} = req;

  try {
    await schema.validateAsync(body, {abortEarly: false});
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json(error);

    return logger.error(`Получены неверные данные. Полученные данные: ${ body }. Ошибка: ${ error }`);
  }

  return next();
};

module.exports.isRequestDataValid = isRequestDataValid;
