'use strict';

const {HttpStatusCode} = require(`../../constants`);
const {hasAllExpectedProperties} = require(`../utils`);

const isRequestDataValid = ({expectedProperties, logger}) => (req, res, next) => {
  const hasNotAllProperties = !hasAllExpectedProperties(req.body, expectedProperties);

  if (hasNotAllProperties) {
    res.status(HttpStatusCode.BAD_REQUEST).send(`Получены неверные данные`);

    return logger.error(`Ожидаются следующие свойства: ${ expectedProperties }, но получены: ${ Object.keys(req.body) }.`);
  }

  return next();
};

exports.isRequestDataValid = isRequestDataValid;
