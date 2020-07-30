'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {readContent} = require(`../../utils/readContent`);
const {FilePath} = require(`../../constants`);
const {API_SERVER_URL} = require(`../../config`);

exports.getAddArticle = async (req, res, next) => {
  try {
    const categories = await readContent(FilePath.CATEGORIES);

    return res.render(`articles/new-post`, {categories});
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
      category,
      announce,
      fullText,
    };

    const {statusCode} = await request.post({url: `${ API_SERVER_URL }/articles`, json: true, body: article});

    if (statusCode === HttpStatusCode.CREATED) {
      return res.redirect(`/my`);
    }

    const categories = await readContent(FilePath.CATEGORIES);

    return res.render(`articles/new-post`, {article, categories});
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

    const categories = await readContent(FilePath.CATEGORIES);

    return res.render(`articles/new-post`, {article, categories});
  } catch (error) {
    return next(error);
  }
};
