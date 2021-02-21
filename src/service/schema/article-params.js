'use strict';

const Joi = require(`joi`);

module.exports.articleParamsSchema = Joi.object({
  articleId: Joi.number(),
});
