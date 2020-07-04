'use strict';

const {request} = require(`../request`);
const {API_URL} = require(`../constants`);
const {HttpStatusCode} = require(`../../constants`);
const {readContent} = require(`../../utils/readContent`);
const {FilePath} = require(`../../constants`);

exports.getEditArticle = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {statusCode, body: article} = await request.get({url: `${ API_URL }/articles/${ id }`, json: true});

    if (statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    const categories = await readContent(FilePath.CATEGORIES);

    return res.render(`articles/new-post`, {article, categories});
  } catch (error) {
    return next(error);
  }
};
