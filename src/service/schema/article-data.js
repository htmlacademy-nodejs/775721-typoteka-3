'use strict';

const Joi = require(`joi`);

const {ArticleTitleRequirements, ArticleAnnounceRequirements, ArticleTextRequirements} = require(`../database/models/article/constants`);

module.exports.articleDataSchema = Joi.object({
  title: Joi.string()
  .min(ArticleTitleRequirements.length.MIN)
  .max(ArticleTitleRequirements.length.MAX)
  .required(),
  createdDate: Joi.string()
  .isoDate(),
  image: Joi.string()
  .pattern(/\w\.(jpg|png)/)
  .allow(``),
  announce: Joi.string()
  .min(ArticleAnnounceRequirements.length.MIN)
  .max(ArticleAnnounceRequirements.length.MAX)
  .required(),
  fullText: Joi.string()
  .max(ArticleTextRequirements.length.MAX),
  categories: Joi.array()
  .items(Joi.string(), Joi.number())
  .min(1)
  .required(),
});
