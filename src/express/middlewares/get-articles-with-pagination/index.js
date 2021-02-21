'use strict';

const {createPaginationPages} = require(`./utils`);
const {DEFAULT_PAGE, ARTICLES_LIMIT_QUANTITY_ON_PAGE} = require(`./constants`);
const {request} = require(`../../request`);
const {API_SERVER_URL} = require(`../../../config`);
const {HttpStatusCode} = require(`../../../constants`);

module.exports.getArticlesWithPagination = async (req, res, next) => {
  const {page} = req.query;
  const {categoryId} = req.params;
  const currentPage = page ? Number.parseInt(page, 10) : DEFAULT_PAGE;
  const offset = (currentPage - 1) * ARTICLES_LIMIT_QUANTITY_ON_PAGE;

  let url = `${ API_SERVER_URL }/articles?offset=${ offset }&limit=${ ARTICLES_LIMIT_QUANTITY_ON_PAGE }`;

  if (categoryId) {
    url = `${url}&categoryId=${categoryId}`;
  }

  let articles = [];
  let articlesQuantity = 0;

  try {
    const {statusCode, body} = await request.get({
      url,
      json: true,
    });

    if (statusCode === HttpStatusCode.OK) {
      articles = body.articles;
      articlesQuantity = body.quantity;
    }
  } catch (error) {
    return next(error);
  }

  const pagesQuantity = Math.ceil(articlesQuantity / ARTICLES_LIMIT_QUANTITY_ON_PAGE);
  const pages = createPaginationPages({quantity: pagesQuantity, currentPage});

  res.locals.articles = articles;
  res.locals.pages = pages;

  return next();
};
