'use strict';

const isAdmin = (req, res, next) => {
  const isNotAdmin = !res.locals.isAdmin;

  if (isNotAdmin) {
    return res.redirect(`/login`);
  }

  return next();
};

exports.isAdmin = isAdmin;
