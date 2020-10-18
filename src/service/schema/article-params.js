'use strict';

const Joi = require(`joi`);

exports.articleParamsSchema = Joi.object({
  articleId: Joi.number(),
});
