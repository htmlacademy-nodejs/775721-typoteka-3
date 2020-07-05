'use strict';

const {HttpStatusCode} = require(`../../constants`);
const {hasAllExpectedProperties, getMissingProperties} = require(`../utils`);

const isRequestDataValid = ({expectedProperties, logger}) => (req, res, next) => {
  const hasNotAllProperties = !hasAllExpectedProperties(req.body, expectedProperties);

  if (hasNotAllProperties) {
    const receivedProperties = Object.keys(req.body);
    const missingProperties = getMissingProperties(req.body, expectedProperties);

    res.status(HttpStatusCode.BAD_REQUEST).send(`Получены неверные данные`);

    return logger.error(`Ожидаются следующие свойства: ${ expectedProperties }, но получены: ${ receivedProperties }. Отсутствуют следующие свойства: ${missingProperties}.`);
  }

  return next();
};

exports.isRequestDataValid = isRequestDataValid;
