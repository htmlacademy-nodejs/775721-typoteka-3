'use strict';

const Joi = require(`joi`);

exports.commentParamsSchema = Joi.object({
  commentId: Joi.number().required(),
});
