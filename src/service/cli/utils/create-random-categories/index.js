'use strict';

const {shuffle, getRandomInteger} = require(`../../../utils`);

module.exports.createRandomCategories = (categories) => shuffle(categories).slice(0, getRandomInteger(1, categories.length));
