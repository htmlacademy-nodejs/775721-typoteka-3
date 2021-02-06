'use strict';

const redirectAuthorizedUsersToHomePage = (req, res, next) => {
  const {isAuthorized} = res.locals;

  if (isAuthorized) {
    return res.redirect(`/`);
  }

  return next();
};

exports.redirectAuthorizedUsersToHomePage = redirectAuthorizedUsersToHomePage;
