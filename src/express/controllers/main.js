'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {API_SERVER_URL} = require(`../../config`);

exports.getMain = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `${ API_SERVER_URL }/articles`, json: true});
    const articles = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`main/main`, {articles});
  } catch (error) {
    next(error);
  }
};

exports.getSearch = async (req, res, next) => {
  try {
    const searchQuery = req.query.search;
    const encodedQuery = encodeURI(searchQuery);

    const {statusCode, body} = await request.get({url: `${ API_SERVER_URL }/search?query=${ encodedQuery }`, json: true});
    const results = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`main/search`, {results, query: searchQuery});
  } catch (error) {
    next(error);
  }
};
