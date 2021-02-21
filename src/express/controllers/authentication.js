'use strict';

const {parseErrorDetailsToErrorMessages} = require(`./utils/parse-error-details-to-error-messages`);
const {AUTHORIZATION_KEY} = require(`../constants`);
const {request} = require(`../request`);
const {HttpStatusCode} = require(`../../constants`);
const {API_SERVER_URL} = require(`../../config`);

exports.getRegister = async (req, res) => {
  res.render(`authentication/register`);
};


exports.postRegister = async (req, res, next) => {
  const avatar = res.locals.imageName;
  const userData = {
    ...req.fields,
    avatar,
  };

  try {
    const {statusCode, body} = await request.post({url: `${ API_SERVER_URL }/user`, json: true, body: userData});

    if (statusCode === HttpStatusCode.CREATED) {
      return res.redirect(HttpStatusCode.SEE_OTHER, `/login`);
    }

    const errorMessages = parseErrorDetailsToErrorMessages(body.details);
    const errors = Object.values(errorMessages);

    return res.render(`authentication/register`, {user: userData, errors});
  } catch (error) {
    return next(error);
  }
};

exports.getLogin = async (req, res, next) => {
  try {
    res.render(`authentication/login`);
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const loginData = req.fields;

  try {
    const {statusCode, body} = await request.post({url: `${API_SERVER_URL}/user/login`, json: true, body: loginData});

    if (statusCode === HttpStatusCode.OK) {
      const {accessToken, refreshToken} = body;

      res.cookie(AUTHORIZATION_KEY, `Bearer ${accessToken} ${refreshToken}`, {httpOnly: true, sameSite: `strict`});

      return res.redirect(`/`);
    }

    const errorMessages = parseErrorDetailsToErrorMessages(body.details);

    return res.render(`authentication/login`, {errors: errorMessages});
  } catch (error) {
    return next(error);
  }
};

exports.getLogout = async (req, res, next) => {
  const {headers, tokens} = res.locals;

  try {
    const {statusCode} = await request.delete({
      url: `${API_SERVER_URL}/user/logout`,
      json: true,
      headers,
      body: {token: tokens.refreshToken},
    });

    if (statusCode === HttpStatusCode.NO_CONTENT) {
      res.clearCookie(AUTHORIZATION_KEY);
      res.redirect(`/`);
    }
  } catch (error) {
    next(error);
  }
};
