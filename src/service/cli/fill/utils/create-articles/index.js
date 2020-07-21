'use strict';

const {createRandomDate} = require(`../../../utils/create-random-date`);
const {createRandomText} = require(`../../../utils/create-random-text`);
const {getRandomInteger} = require(`../../../../utils`);
const {AnnounceSizeLimit} = require(`../../../constants`);
const {TextSizeLimit} = require(`./constants`);

exports.createArticles = ({quantity, users, titles, sentences}) => Array.from({length: quantity}, (_, index) => {
  const user = users[getRandomInteger(0, users.length - 1)];

  const id = index + 1;
  const userId = user && user.id;
  const image = `/img/article-${ id }.jpg`;
  const title = titles[getRandomInteger(0, titles.length - 1)];
  const createdDate = createRandomDate();
  const announce = createRandomText(sentences, {min: AnnounceSizeLimit.MIN, max: AnnounceSizeLimit.MAX});
  const text = createRandomText(sentences, {min: TextSizeLimit.MIN, max: TextSizeLimit.MAX});

  return {
    id,
    userId,
    image,
    createdDate,
    title,
    announce,
    text,
  };
});
