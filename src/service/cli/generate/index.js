`use strict`;

const fs = require(`fs`).promises;

const chalk = require(`chalk`);
const { nanoid } = require(`nanoid`);

const {
  MODULE_NAME,
  DAY_IN_MILLISECONDS,
  DATE_LIMIT_IN_DAYS,
  FilePath,
  QuantityLimit,
  AnnounceSizeLimit,
  CommentTextSentencesLimit,
  CommentsQuantityLimit,
} = require(`./constants`);
const { ExitCode, FILE_MOCKS_PATH, MAX_ID_LENGTH } = require(`../../constants`);
const { getRandomInteger, shuffle } = require(`../../utils`);

const createRandomDate = () => {
  const date = new Date(Date.now() - getRandomInteger(0, DAY_IN_MILLISECONDS * DATE_LIMIT_IN_DAYS));

  return date.toLocaleString();
};

const createComment = (comments) => ({
  id: nanoid(MAX_ID_LENGTH),
  text: shuffle(comments).slice(0, getRandomInteger(CommentTextSentencesLimit.MIN, CommentTextSentencesLimit.MAX)).join(` `),
});

const createComments = (quantity, comments) => Array.from({ length: quantity }, () => createComment(comments));

const createPublication = ({ titles, categories, sentences, comments }) => ({
  id: nanoid(MAX_ID_LENGTH),
  title: titles[getRandomInteger(0, titles.length - 1)],
  createdDate: createRandomDate(),
  announce: shuffle(sentences).slice(0, getRandomInteger(AnnounceSizeLimit.MIN, AnnounceSizeLimit.MAX)).join(` `),
  fullText: shuffle(sentences).slice(0, getRandomInteger(0, sentences.length)).join(` `),
  category: shuffle(categories).slice(0, getRandomInteger(0, categories.length)),
  comments: createComments(getRandomInteger(CommentsQuantityLimit.MIN, CommentsQuantityLimit.MAX), comments),
});

const readContent = async (filePath) => {
  let result = [];

  try {
    const content = await fs.readFile(filePath, `utf-8`);

    result = content.split(`\n`).filter(Boolean);
  } catch (error) {
    console.error(chalk.red(error));
  }

  return result;
};

const getMockContent = async (filePaths) => {
  const promises = filePaths.map((filePath) => readContent(filePath));

  return await Promise.all(promises);
};

const generatePublications = async (quantity) => {
  const filePaths = Object.values(FilePath);
  const [titles, categories, sentences, comments] = await getMockContent(filePaths);

  return Array.from({ length: quantity }, () => createPublication({ titles, categories, sentences, comments }));
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
      console.error(chalk.red(`Не могу создать ${ QuantityLimit.MAX } публикаций`));

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
  }
}
