'use strict';

const {request} = require(`../request`);
const {API_SERVER_URL} = require(`../../config`);
const {HttpStatusCode} = require(`../../constants`);

module.exports.getAllCategories = async (req, res, next) => {
  const {categoryId} = req.params;

  let categories = [];

  try {
    const {statusCode, body} = await request.get({
      url: `${ API_SERVER_URL }/categories`,
      json: true,
    });

    if (statusCode === HttpStatusCode.OK) {
      categories = body;
    }
  } catch (error) {
    next(error);
  }

  if (categoryId && categories.length) {
    categories = categories.map((categoryItem) => {
      categoryItem.isActive = categoryItem.id.toString() === categoryId;

      return categoryItem;
    });
  }

  res.locals.categories = categories;

  return next();
};
