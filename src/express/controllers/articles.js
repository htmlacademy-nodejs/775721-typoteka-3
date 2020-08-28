'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {API_SERVER_URL} = require(`../../config`);

exports.getAddArticle = async (req, res, next) => {
  try {
    const categoriesResult = await request.get({url: `${ API_SERVER_URL }/categories`, json: true});

    if (categoriesResult.statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`articles/new-post`, {categories: categoriesResult.body});
  } catch (error) {
    return next();
  }
};

exports.postAddArticle = async (req, res, next) => {
  try {
    const {createdDate, title, category, announce, fullText} = req.body;

    const article = {
      title,
      createdDate,
      categories: category,
      announce,
      fullText,
    };

    const {statusCode} = await request.post({url: `${ API_SERVER_URL }/articles`, json: true, body: article});

    if (statusCode === HttpStatusCode.CREATED) {
      return res.redirect(`/my`);
    }

    const categoriesResult = await request.get({url: `${ API_SERVER_URL }/categories`, json: true});

    if (categoriesResult.statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`articles/new-post`, {article, categories: categoriesResult.body});
  } catch (error) {
    return next();
  }
};

exports.getEditArticle = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {statusCode, body: article} = await request.get({url: `${ API_SERVER_URL }/articles/${ id }`, json: true});

    if (statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    const categoriesResult = await request.get({url: `${ API_SERVER_URL }/categories`, json: true});

    if (categoriesResult.statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`articles/new-post`, {article, categories: categoriesResult.body});
  } catch (error) {
    return next(error);
  }
};
