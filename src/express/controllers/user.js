'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {API_SERVER_URL} = require(`../../config`);

exports.getUserMain = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `${ API_SERVER_URL }/articles`, json: true});
    const articles = statusCode === HttpStatusCode.OK ? body.articles : [];

    res.render(`user/my`, {articles});
  } catch (error) {
    next(error);
  }
};

exports.getUserComments = async (req, res, next) => {
  const {user} = res.locals;

  try {
    const {statusCode, body} = request.get({url: `${ API_SERVER_URL }/comments?userId=${user.id}`, json: true});
    const comments = statusCode === HttpStatusCode.OK ? body.articles : [];

    res.render(`user/comments`, {comments});
  } catch (error) {
    next(error);
  }
};
