'use strict';

const Joi = require(`joi`);

const {CommentMessageRequirements} = require(`../database/models/comment/constants`);

module.exports.commentSchema = Joi.object({
  articleId: Joi.number().required(),
  text: Joi.string()
  .min(CommentMessageRequirements.length.MIN)
  .required(),
});
