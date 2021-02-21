'use strict';

const Joi = require(`joi`);

exports.mostCommentedArticlesParams = Joi.object({
  limit: Joi.number(),
});
