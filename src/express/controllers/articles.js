'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {API_SERVER_URL} = require(`../../config`);
const {parseErrorDetailsToErrorMessages} = require(`./utils/parse-error-details-to-error-messages`);


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
    const {createdDate, title, category = [], announce, fullText} = req.fields;
    const {headers} = res.locals;
    const categories = Array.isArray(category) ? category : [category];
    const article = {
      title,
      announce,
      categories,
    };

    if (createdDate) {
      article.createdDate = new Date(createdDate).toISOString();
    }

    if (fullText) {
      article.fullText = fullText;
    }

    const {statusCode, body} = await request.post({url: `${ API_SERVER_URL }/articles`, headers, json: true, body: article});

    if (statusCode === HttpStatusCode.CREATED) {
      return res.redirect(`/my`);
    }

    const categoriesResult = await request.get({url: `${ API_SERVER_URL }/categories`, json: true});

    if (categoriesResult.statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    const errorDetails = body.details || [];
    const errorMessages = parseErrorDetailsToErrorMessages(errorDetails);

    return res.render(`articles/new-post`, {article, categories: categoriesResult.body, errors: errorMessages});
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

exports.getArticlesByCategory = async (req, res, next) => {
  const {categoryId} = req.params;

  try {
    const {statusCode, body} = await request.get({url: `${ API_SERVER_URL }/categories/${categoryId}`, json: true});

    if (statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    return res.render(`articles/articles-by-category`, {category: body});
  } catch (error) {
    return next(error);
  }
};

exports.getArticle = async (req, res, next) => {
  const {id} = req.params;
  const {previousUrl, errorMessages: errorMessagesJSON} = req.query;
  const {categories} = res.locals;

  try {
    const errorMessages = errorMessagesJSON && JSON.parse(errorMessagesJSON);

    const {statusCode, body: article} = await request.get({url: `${ API_SERVER_URL }/articles/${id}`, json: true});

    if (statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    const articleCategories = categories.filter((categoryItem) => article.categories.find((articleCategoryId) => categoryItem.id === articleCategoryId.id));

    return res.render(`articles/post`, {article, categories: articleCategories, previousUrl, errors: errorMessages});
  } catch (error) {
    return next(error);
  }
};

exports.postComment = async (req, res, next) => {
  const {id} = req.params;
  const {previousUrl} = req.query;
  const {headers} = res.locals;
  const {text} = req.fields;
  const commentData = {
    articleId: id,
    text,
  };

  try {
    const {statusCode, body} = await request.post({url: `${ API_SERVER_URL }/comments`, headers, body: commentData, json: true});

    if (statusCode === HttpStatusCode.CREATED) {
      return res.redirect(`/articles/${id}?previousUrl=${previousUrl}`);
    }

    const errorDetails = body.details || [];
    const errorMessages = parseErrorDetailsToErrorMessages(errorDetails);
    const errorMessagesJSON = JSON.stringify(errorMessages);

    return res.redirect(`/articles/${id}?previousUrl=${previousUrl}&errorMessages=${errorMessagesJSON}`);
  } catch (error) {
    return next(error);
  }
};
