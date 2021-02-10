'use strict';

const path = require(`path`);
const fs = require(`fs`).promises;

const {request} = require(`../request`);
const {DirName} = require(`../constants`);
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
  const {headers, article} = res.locals;

  try {
    const {statusCode, body} = await request.post({url: `${ API_SERVER_URL }/articles`, headers, json: true, body: article});

    if (statusCode === HttpStatusCode.CREATED) {
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
  const action = `/articles/edit/${id}?_csrf=${res.locals.csrfToken}`;

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

exports.postEditArticle = async (req, res, next) => {
  const {id} = req.params;
  const {headers, article} = res.locals;
  let previousImageName;

  try {
    if (article.image) {
      const {statusCode, body: updatingArticle} = await request.get({url: `${ API_SERVER_URL }/articles/${id}`, json: true});

      if (statusCode === HttpStatusCode.NOT_FOUND) {
        return res.status(HttpStatusCode.NOT_FOUND).render(`errors/404`);
      }

      previousImageName = updatingArticle.image;
    }

    const {statusCode, body} = await request.put({url: `${ API_SERVER_URL }/articles/${id}`, headers, json: true, body: article});

    if (statusCode === HttpStatusCode.OK) {
      if (previousImageName) {
        const imagePath = path.resolve(__dirname, `../${DirName.PUBLIC}/img/${previousImageName}`);

        fs.unlink(imagePath);
      }

      return res.redirect(`/my`);
    }

    const errorDetails = body.details || [];
    const errorMessages = parseErrorDetailsToErrorMessages(errorDetails);
    const errorMessagesJSON = JSON.stringify(errorMessages);
    const articleDataJSON = JSON.stringify(article);

    return res.redirect(`/articles/edit/${id}?errorMessages=${errorMessagesJSON}&articleData=${articleDataJSON}`);
  } catch (error) {
    return next(error);
  }
};

exports.getDeleteArticle = async (req, res, next) => {
  const {id} = req.params;
  const {headers} = res.locals;

  try {
    const {statusCode, body} = await request.delete({url: `${ API_SERVER_URL }/articles/${ id }`, headers, json: true});

    if (statusCode === HttpStatusCode.OK) {
      const imageName = body.image;
      const imagePath = path.resolve(__dirname, `../${DirName.PUBLIC}/img/${imageName}`);

      fs.unlink(imagePath);
    }

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
