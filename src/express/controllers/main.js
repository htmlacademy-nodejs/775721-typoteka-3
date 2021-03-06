'use strict';

const {request} = require(`../request`);
const {API_SERVER_URL} = require(`../../config`);
const {HttpStatusCode} = require(`../../constants`);

module.exports.getMain = async (req, res, next) => {
  try {
    const mostCommentedArticlesResponse = await request.get({
      url: `${ API_SERVER_URL }/articles/most_commented`,
      json: true,
    });
    const hotArticles = mostCommentedArticlesResponse.statusCode === HttpStatusCode.OK ? mostCommentedArticlesResponse.body : [];

    const commentsResponse = await request.get({
      url: `${ API_SERVER_URL }/comments?limit=3`,
      json: true,
    });

    const comments = commentsResponse.statusCode === HttpStatusCode.OK ? commentsResponse.body : [];

    res.render(`main/main`, {hotArticles, comments});
  } catch (error) {
    next(error);
  }
};

module.exports.getSearch = async (req, res, next) => {
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

module.exports.getHttpCodes = (req, res) => {
  res.render(`main/http-codes`);
};
