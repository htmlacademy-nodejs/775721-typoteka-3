'use strict';

const {parseErrorDetailsToErrorMessages} = require(`./utils/parse-error-details-to-error-messages`);
const {request} = require(`../request`);
const {API_SERVER_URL} = require(`../../config`);
const {HttpStatusCode} = require(`../../constants`);

exports.getCategories = (req, res, next) => {
  const {categories} = res.locals;
  const {errorMessages: errorMessagesJSON, categoryWithErrorId} = req.query;

  try {
    const errors = errorMessagesJSON && JSON.parse(errorMessagesJSON);

    res.render(`categories/all-categories`, {categories, errors, categoryWithErrorId});
  } catch (error) {
    next(error);
  }
};

exports.postCategories = async (req, res, next) => {
  try {
    const {statusCode, body} = await request.post({url: `${ API_SERVER_URL }/categories`, json: true, body: req.fields});

    if (statusCode === HttpStatusCode.BAD_REQUEST) {
      const errorMessages = parseErrorDetailsToErrorMessages(body.details);
      const errorMessagesJSON = JSON.stringify(errorMessages);

      res.redirect(`/categories?errorMessages=${errorMessagesJSON}`);
    }

    return res.redirect(`/categories`);
  } catch (error) {
    return next(error);
  }
};

exports.postEditCategory = async (req, res, next) => {
  const {id} = req.params;

  try {
    const {statusCode, body} = await request.put({url: `${ API_SERVER_URL }/categories/${id}`, json: true, body: req.fields});

    if (statusCode === HttpStatusCode.BAD_REQUEST) {
      const errorMessages = parseErrorDetailsToErrorMessages(body.details);
      const errorMessagesJSON = JSON.stringify(errorMessages);

      res.redirect(`/categories?errorMessages=${errorMessagesJSON}&categoryWithErrorId=${id}`);
    }

    return res.redirect(`/categories`);
  } catch (error) {
    return next(error);
  }
};

exports.getDeleteCategory = async (req, res, next) => {
  const {id} = req.params;

  try {
    await request.delete({url: `${ API_SERVER_URL }/categories/${id}`, json: true});

    return res.redirect(`/categories`);
  } catch (error) {
    return next(error);
  }
};
