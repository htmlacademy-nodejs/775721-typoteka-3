'use strict';

const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {API_SERVER_URL} = require(`../../config`);

exports.getRegister = async (req, res, next) => {
  try {
    res.render(`authentication/register`);
  } catch (error) {
    next(error);
  }
};


exports.postRegister = async (req, res, next) => {
  try {
    const userData = req.fields;

    const {statusCode, body} = await request.post({url: `${ API_SERVER_URL }/user`, json: true, body: userData});

    if (statusCode === HttpStatusCode.CREATED) {
      return res.redirect(HttpStatusCode.SEE_OTHER, `/login`);
    }

    const errorMessages = body.details.reduce((messages, {path, message}) => {
      const key = path.toString();

      messages[key] = message;

      return messages;
    }, {});

    return res.render(`authentication/register`, {user: userData, errors: errorMessages});
  } catch (error) {
    return next(error);
  }
};
