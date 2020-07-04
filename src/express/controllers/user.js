'use strict';

const {request} = require(`../request`);
const {API_URL} = require(`../constants`);
const {HttpStatusCode} = require(`../../constants`);

exports.getUserMain = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `${ API_URL }/articles`, json: true});
    const articles = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`user/my`, {articles});
  } catch (error) {
    next(error);
  }
};
