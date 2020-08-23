'use strict';

const {request} = require(`../request`);
const {API_SERVER_URL} = require(`../../config`);
const {createPaginationPages} = require(`./utils/create-pagination-pages`);
const {HttpStatusCode} = require(`../../constants`);
const {ARTICLES_LIMIT_QUANTITY_ON_PAGE} = require(`./constants`);

const DEFAULT_PAGE = 1;

exports.getMain = async (req, res, next) => {
  const {page} = req.query;
  const currentPage = page ? Number.parseInt(page, 10) : DEFAULT_PAGE;
  const offset = (currentPage - 1) * ARTICLES_LIMIT_QUANTITY_ON_PAGE;

  let articles = [];
  let articlesQuantity = 0;

  try {
    const {statusCode, body} = await request.get({
      url: `${ API_SERVER_URL }/articles?offset=${ offset }&limit=${ ARTICLES_LIMIT_QUANTITY_ON_PAGE }`,
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

  return res.render(`main/main`, {articles, pages});
};

exports.getSearch = async (req, res, next) => {
  try {
    const searchQuery = req.query.search;
    const encodedQuery = encodeURI(searchQuery);

    const {statusCode, body} = await request.get({
      url: `${ API_SERVER_URL }/search?query=${ encodedQuery }`,
      json: true,
    });
    const results = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`main/search`, {results, query: searchQuery});
  } catch (error) {
    next(error);
  }
};
