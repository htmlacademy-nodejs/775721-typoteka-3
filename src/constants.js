'use strict';

exports.HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  SEE_OTHER: 303,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

exports.FilePath = {
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  SENTENCES: `./data/sentences.txt`,
  COMMENTS: `./data/comments.txt`,
};

exports.ExitCode = {
  ERROR: 1,
};
