'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isAdmin = ({userService, logger}) => async (req, res, next) => {
  const userId = res.locals.userId;

  try {
    const isNotAdmin = !await userService.isUserAdmin(userId);

    if (isNotAdmin) {
      logger.error(`У пользователя с id: ${userId} нет прав админа.`);

      return res.sendStatus(HttpStatusCode.FORBIDDEN);
    }

    res.locals.isAdmin = true;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports.isAdmin = isAdmin;
