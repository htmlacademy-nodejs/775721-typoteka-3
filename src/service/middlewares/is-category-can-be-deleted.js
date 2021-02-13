'use strict';

const {HttpStatusCode} = require(`../../constants`);

const isCategoryCanBeDeleted = ({categoryService, logger}) => async (req, res, next) => {
  const categoryId = req.params.categoryId || req.query.categoryId || req.body.categoryId;

  const isNotEmpty = !await categoryService.isEmpty(categoryId);

  if (isNotEmpty) {
    const message = `Категория с id: ${ categoryId } используется некоторыми публикациями. Сперва нужно удалить публикации.`;

    res.status(HttpStatusCode.FORBIDDEN).send(message);

    return logger.error(message);
  }

  return next();
};

exports.isCategoryCanBeDeleted = isCategoryCanBeDeleted;
