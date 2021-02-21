'use strict';

const isAuthorizedUser = (req, res, next) => {
  const hasNotAccess = !res.locals.isAuthorized;

  if (hasNotAccess) {
    return res.redirect(`/login`);
  }

  return next();
};

module.exports.isAuthorizedUser = isAuthorizedUser;
