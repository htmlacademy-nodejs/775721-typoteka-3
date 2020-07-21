'use strict';

const {shuffle, getRandomInteger} = require(`../../../utils`);

exports.createRandomCategories = (categories) => shuffle(categories).slice(0, getRandomInteger(0, categories.length));
