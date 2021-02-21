'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {API_SERVER_URL} = require(`../../config`);

module.exports.getUserMain = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `${ API_SERVER_URL }/articles`, json: true});
    const articles = statusCode === HttpStatusCode.OK ? body.articles : [];

    res.render(`user/my`, {articles});
  } catch (error) {
    next(error);
  }
};

module.exports.getUserComments = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `${ API_SERVER_URL }/comments`, json: true});
    const comments = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`user/comments`, {comments});
  } catch (error) {
    next(error);
  }
};

module.exports.getDeleteComment = async (req, res, next) => {
  const {id} = req.params;
  const {headers} = res.locals;

  try {
    await request.delete({url: `${ API_SERVER_URL }/comments/${id}`, headers, json: true});

    res.redirect(`/my/comments`);
  } catch (error) {
    next(error);
  }
};
