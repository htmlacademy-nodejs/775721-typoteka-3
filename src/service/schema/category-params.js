'use strict';

const Joi = require(`joi`);

exports.categoryParamsSchema = Joi.object({
  categoryId: Joi.number(),
});
