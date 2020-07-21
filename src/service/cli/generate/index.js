'use strict';

const fs = require(`fs`).promises;

const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {getMockContent} = require(`../utils/get-mock-content`);
const {createRandomDate} = require(`../utils/create-random-date`);
const {createRandomCategories} = require(`../utils/create-random-categories`);
const {createRandomText} = require(`../utils/create-random-text`);
const {FilePath} = require(`../../../constants`);
const {QuantityLimit, AnnounceSizeLimit, CommentTextSentencesLimit} = require(`../constants`);

const {
  MODULE_NAME,
  CommentsQuantityLimit,
} = require(`./constants`);
const {ExitCode, FILE_MOCKS_PATH, MAX_ID_LENGTH} = require(`../../constants`);
const {getRandomInteger} = require(`../../utils`);

const createComment = (comments) => ({
  id: nanoid(MAX_ID_LENGTH),
  text: createRandomText(comments, {min: CommentTextSentencesLimit.MIN, max: CommentTextSentencesLimit.MAX}),
});

const createComments = (quantity, comments) => Array.from({length: quantity}, () => createComment(comments));

const createPublication = ({titles, categories, sentences, comments}) => ({
  id: nanoid(MAX_ID_LENGTH),
  title: titles[getRandomInteger(0, titles.length - 1)],
  createdDate: createRandomDate(),
  announce: createRandomText(sentences, {min: AnnounceSizeLimit.MIN, max: AnnounceSizeLimit.MAX}),
  fullText: createRandomText(sentences),
  category: createRandomCategories(categories),
  comments: createComments(getRandomInteger(CommentsQuantityLimit.MIN, CommentsQuantityLimit.MAX), comments),
});

const generatePublications = async (quantity) => {
  const filePaths = Object.values(FilePath);
  const [titles, categories, sentences, comments] = await getMockContent(filePaths);

  return Array.from({length: quantity}, () => createPublication({titles, categories, sentences, comments}));
};

module.exports = {
  name: MODULE_NAME,
  async run(parameters) {
    const [rawQuantity] = parameters;
    const quantity = Number.parseInt(rawQuantity, 10) || QuantityLimit.MIN;

    if (quantity > QuantityLimit.MAX) {
      console.error(chalk.red(`Не больше ${ QuantityLimit.MAX } публикаций`));

      process.exit(ExitCode.ERROR);
    }

    if (quantity < 0) {
      console.error(chalk.red(`Не могу создать ${ quantity } публикаций`));

      process.exit(ExitCode.ERROR);
    }

    try {
      const publications = await generatePublications(quantity);
      const content = JSON.stringify(publications);

      await fs.writeFile(FILE_MOCKS_PATH, content);
    } catch (error) {
      console.error(chalk.red(`Не получилось записать данные в файл...`));

      process.exit(ExitCode.ERROR);
    }

    console.info(chalk.green(`Файл с данными успешно создан.`));
  },
};
