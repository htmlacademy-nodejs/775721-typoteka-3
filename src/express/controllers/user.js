'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {API_SERVER_URL} = require(`../../config`);

const REQUIRED_NUMBER_OF_COMMENTS = 3;

exports.getUserMain = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `${ API_SERVER_URL }/articles`, json: true});
    const articles = statusCode === HttpStatusCode.OK ? body : [];

    res.render(`user/my`, {articles});
  } catch (error) {
    next(error);
  }
};

exports.getUserComments = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.get({url: `${ API_SERVER_URL }/articles`, json: true});
    const articles = statusCode === HttpStatusCode.OK ? body : [];
    const requiredArticles = articles.slice(0, REQUIRED_NUMBER_OF_COMMENTS);
    const requiredArticlesIds = requiredArticles.map(({id}) => id);

    const commentsRequests = requiredArticlesIds.map((id) => request.get({
      url: `${ API_SERVER_URL }/articles/${ id }/comments`,
      json: true,
    }));
    const commentsResponses = await Promise.all(commentsRequests);
    const comments = commentsResponses.map(({statusCode: commentsStatusCode, body: commentsBody}) => commentsStatusCode === HttpStatusCode.OK ? commentsBody : []);
    const userComments = comments.flat();

    res.render(`user/comments`, {comments: userComments});
  } catch (error) {
    next(error);
  }
};
