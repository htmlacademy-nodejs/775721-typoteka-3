'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isUserEmailUnique = ({service, logger}) => async (req, res, next) => {
  const {email} = req.body;

  try {
    const isExists = await service.isExist(email);

    if (isExists) {
      const errorMessage = `Пользователь с email: ${ email } уже существует!`;

      res.status(HttpStatusCode.BAD_REQUEST).json({
        details: [
          {
            path: `email`,
            message: errorMessage,
          },
        ],
      });

      return logger.error(errorMessage);
    }
  } catch (error) {
    next(error);
  }

  return next();
};

exports.isUserEmailUnique = isUserEmailUnique;
