'use strict';

const isAuthorizedUser = (req, res, next) => {
  const hasNotAccess = !res.locals.isAuthorized;

  if (hasNotAccess) {
    return res.redirect(`/login`);
  }

  return next();
};

exports.isAuthorizedUser = isAuthorizedUser;
