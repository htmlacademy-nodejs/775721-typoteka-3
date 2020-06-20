'use strict';

exports.Route = {
  INDEX: `/`,
  ARTICLE: `/:articleId`,
  COMMENTS: `/:articleId/comments`,
};

exports.EXPECTED_PROPERTIES = [`title`, `announce`, `fullText`, `category`];
