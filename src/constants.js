'use strict';

module.exports.HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  SEE_OTHER: 303,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.FilePath = {
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  SENTENCES: `./data/sentences.txt`,
  COMMENTS: `./data/comments.txt`,
};

module.exports.ExitCode = {
  ERROR: 1,
};

module.exports.UserRole = {
  ADMIN: `admin`,
  READER: `reader`,
};
