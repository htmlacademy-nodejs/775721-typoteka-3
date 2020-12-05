'use strict';

const jwt = require(`jsonwebtoken`);

const {HttpStatusCode} = require(`../../constants`);
const {JWT_ACCESS_SECRET} = require(`../../config`);

const isUserAuthorized = ({logger}) => async (req, res, next) => {
  const {authorization} = req.headers;

  if (!authorization) {
    logger.error(`Не могу авторизовать пользователя. Отсутствуют необходимые заголовки`);

    return res.sendStatus(HttpStatusCode.UNAUTHORIZED);
  }

  const [, accessToken] = authorization.split(` `);

  if (!accessToken) {
    logger.error(`Не могу авторизовать пользователя. Нет токена доступа`);

    return res.sendStatus(HttpStatusCode.UNAUTHORIZED);
  }

  jwt.verify(accessToken, JWT_ACCESS_SECRET, (error) => {
    if (error) {
      logger.error(`Не могу авторизовать пользователя. Неверный токен доступа`);

      return res.sendStatus(HttpStatusCode.FORBIDDEN);
    }

    return next();
  });

  return null;
};

exports.isUserAuthorized = isUserAuthorized;
