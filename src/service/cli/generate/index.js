`use strict`;

const fs = require(`fs`).promises;

const chalk = require(`chalk`);

const {
  MODULE_NAME,
  FILE_NAME, QuantityLimit,
  AnnounceSizeLimit,
  DAY_IN_MILLISECONDS,
  DATE_LIMIT_IN_DAYS,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_SENTENCES_PATH,
} = require(`./constants`);
const { ExitCode } = require(`../../constants`);
const { getRandomInteger, shuffle } = require(`../../utils`);

const createRandomDate = () => {
  const date = new Date(Date.now() - getRandomInteger(0, DAY_IN_MILLISECONDS * DATE_LIMIT_IN_DAYS));

  return date.toLocaleString();
};

const createPublication = ({ titles, categories, sentences }) => ({
  title: titles[getRandomInteger(0, titles.length - 1)],
  createdDate: createRandomDate(),
  announce: shuffle(sentences).slice(0, getRandomInteger(AnnounceSizeLimit.MIN, AnnounceSizeLimit.MAX)).join(` `),
  fullText: shuffle(sentences).slice(0, getRandomInteger(0, sentences.length)).join(` `),
  category: shuffle(categories).slice(0, getRandomInteger(0, categories.length)),
});

const generatePublications = async (quantity) => {
  const titles = await readContent(FILE_TITLES_PATH);
  const categories = await readContent(FILE_CATEGORIES_PATH);
  const sentences = await readContent(FILE_SENTENCES_PATH);

  return Array.from({ length: quantity }, () => createPublication({ titles, categories, sentences }));
};

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

module.exports = {
  name: MODULE_NAME,
  async run(parameters) {
    const [rawQuantity] = parameters;
    const quantity = Number.parseInt(rawQuantity, 10) || QuantityLimit.MIN;

    if (quantity > QuantityLimit.MAX) {
      console.error(chalk.red(`Не больше ${ QuantityLimit.MAX } публикаций`));

      process.exit(ExitCode.ERROR);
    }

    try {
      const publications = await generatePublications(quantity);
      const content = JSON.stringify(publications);

      await fs.writeFile(FILE_NAME, content);
    } catch (error) {
      console.error(chalk.red(`Не получилось записать данные в файл...`));

      process.exit(ExitCode.ERROR);
    }

    console.info(chalk.green(`Файл с данными успешно создан.`));
  }
}
