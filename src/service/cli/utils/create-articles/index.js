'use strict';

const chalk = require(`chalk`);

const {getMockContent} = require(`../get-mock-content`);
const {createRandomDate} = require(`../create-random-date`);
const {createRandomText} = require(`../create-random-text`);
const {getRandomInteger} = require(`../../../utils`);
const {FilePath} = require(`../../../../constants`);
const {AnnounceSizeLimit} = require(`../../constants`);
const {TextSizeLimit} = require(`./constants`);

exports.createArticles = async ({quantity, users}) => {
  let articles = [];

  try {
    const [titles, sentences] = await getMockContent([FilePath.TITLES, FilePath.SENTENCES]);

    articles = Array.from({length: quantity}, (_, index) => {
      const user = users[getRandomInteger(0, users.length - 1)];

      const id = index + 1;
      const userId = user && user.id;
      const image = `article-${ id }.jpg`;
      const title = titles[getRandomInteger(0, titles.length - 1)];
      const createdDate = createRandomDate();
      const announce = createRandomText(sentences, {min: AnnounceSizeLimit.MIN, max: AnnounceSizeLimit.MAX});
      const text = createRandomText(sentences, {min: TextSizeLimit.MIN, max: TextSizeLimit.MAX});

      return {
        id,
        image,
        title,
        announce,
        text,
        [`user_id`]: userId,
        [`created_date`]: createdDate,
      };
    });
  } catch (error) {
    console.error(chalk.red(`Не могу создать публикации`));
  }

  return articles;
};
