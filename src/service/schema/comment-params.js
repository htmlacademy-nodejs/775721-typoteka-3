'use strict';

const Joi = require(`joi`);

exports.commentParamsSchema = Joi.object({
  articleId: Joi.number(),
  commentId: Joi.number(),
});
