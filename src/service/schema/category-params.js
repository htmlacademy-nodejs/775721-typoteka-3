'use strict';

const Joi = require(`joi`);

module.exports.categoryParamsSchema = Joi.object({
  categoryId: Joi.number(),
});
