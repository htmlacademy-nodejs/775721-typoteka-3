'use strict';

const {shuffle, getRandomInteger} = require(`../../../utils`);

module.exports.createRandomText = (sentences, limits = {}) => {
  const {min = 0, max = sentences.length} = limits;

  return shuffle(sentences).slice(0, getRandomInteger(min, max)).join(` `);
};
