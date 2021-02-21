'use strict';

const Joi = require(`joi`);

module.exports.commentParamsSchema = Joi.object({
  commentId: Joi.number().required(),
});
