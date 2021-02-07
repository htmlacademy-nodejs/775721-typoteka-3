'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {API_SERVER_URL} = require(`../../config`);
const {parseErrorDetailsToErrorMessages} = require(`./utils/parse-error-details-to-error-messages`);


exports.getAddArticle = async (req, res, next) => {
  const {errorMessages: errorMessagesJSON, articleData: articleDataJSON} = req.query;
  const action = `/articles/add?_csrf=${res.locals.csrfToken}`;

  try {
    const errors = errorMessagesJSON && JSON.parse(errorMessagesJSON);
    const articleData = articleDataJSON && JSON.parse(articleDataJSON);

    return res.render(`articles/new-post`, {
      title: `Новая публикация`,
      action,
      errors,
      article: articleData,
    });
  } catch (error) {
    return next();
  }
};

exports.postAddArticle = async (req, res, next) => {
  const {articleId} = req.query;
  const url = articleId ? `${ API_SERVER_URL }/articles/${articleId}` : `${ API_SERVER_URL }/articles`;
  const requestFunction = articleId ? request.put : request.post;

  try {
    const {createdDate, title, announce, fullText, ...categoriesObject} = req.fields;

    const {headers} = res.locals;
    const categories = Object.values(categoriesObject);
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

    const {statusCode, body} = await requestFunction({url, headers, json: true, body: article});

    if (statusCode === HttpStatusCode.CREATED || statusCode === HttpStatusCode.OK) {
      return res.redirect(`/my`);
    }

    const errorDetails = body.details || [];
    const errorMessages = parseErrorDetailsToErrorMessages(errorDetails);
    const errorMessagesJSON = JSON.stringify(errorMessages);
    const articleDataJSON = JSON.stringify(article);

    return res.redirect(`/articles/add?errorMessages=${errorMessagesJSON}&articleData=${articleDataJSON}`);
  } catch (error) {
    return next(error);
  }
};

exports.getEditArticle = async (req, res, next) => {
  const {id} = req.params;
  const action = `/articles/add?_csrf=${res.locals.csrfToken}&articleId=${id}`;

  try {
    const {statusCode, body: article} = await request.get({url: `${ API_SERVER_URL }/articles/${ id }`, json: true});

    if (statusCode === HttpStatusCode.NOT_FOUND) {
      return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
    }

    const categories = article.categories.map(({id: categoryId}) => categoryId.toString());
    const articleData = {
      ...article,
      categories,
    };

    return res.render(`articles/new-post`, {
      title: `Редактировать публикацию`,
      action,
      article: articleData,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getDeleteArticle = async (req, res, next) => {
  const {id} = req.params;
  const {headers} = res.locals;

  try {
    await request.delete({url: `${ API_SERVER_URL }/articles/${ id }`, headers, json: true});

    return res.redirect(`/my`);
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
