'use strict';

const Joi = require(`joi`);

exports.getResponseCommentQueryParamsSchema = Joi.object({
  limit: Joi.number(),
  userId: Joi.number(),
  articleId: Joi.number(),
});
