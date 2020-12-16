'use strict';

const {request} = require(`../request`);
const {API_SERVER_URL} = require(`../../config`);
const {HttpStatusCode} = require(`../../constants`);

const TOP_COMMENTED_LIMIT = 5;

exports.getMain = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({
      url: `${ API_SERVER_URL }/articles/most_commented?limit=${TOP_COMMENTED_LIMIT}`,
      json: true,
    });
    const hotArticles = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`main/main`, {hotArticles});
  } catch (error) {
    next(error);
  }
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
