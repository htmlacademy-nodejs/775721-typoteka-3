'use strict';

const {getRandomInteger} = require(`../../../utils`);
const {DAY_IN_MILLISECONDS, DATE_LIMIT_IN_DAYS} = require(`./constants`);

module.exports.createRandomDate = () => {
  const date = new Date(Date.now() - getRandomInteger(0, DAY_IN_MILLISECONDS * DATE_LIMIT_IN_DAYS));

  return date.toUTCString();
};
