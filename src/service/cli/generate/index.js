`use strict`;

const fs = require(`fs`);

const { MODULE_NAME, FILE_NAME, QuantityLimit, TITLES, SENTENCES, AnnounceSizeLimit, CATEGORIES, DAY_IN_MILLISECONDS, DATE_LIMIT_IN_DAYS } = require(`./constants`);
const { ExitCode } = require(`../../constants`);
const { getRandomInteger, shuffle } = require(`../../utils`);

const createRandomDate = () => {
  const date = new Date(Date.now() - getRandomInteger(0, DAY_IN_MILLISECONDS * DATE_LIMIT_IN_DAYS));

  return date.toLocaleString();
};

const createPublication = () => ({
  title: TITLES[getRandomInteger(0, TITLES.length - 1)],
  createdDate: createRandomDate(),
  announce: shuffle(SENTENCES).slice(0, getRandomInteger(AnnounceSizeLimit.MIN, AnnounceSizeLimit.MAX)).join(` `),
  fullText: shuffle(SENTENCES).slice(0, getRandomInteger(0, SENTENCES.length)).join(` `),
  category: shuffle(CATEGORIES).slice(0, getRandomInteger(0, SENTENCES.length)),
});

const generatePublications = (quantity) => Array.from({ length: quantity }, () => createPublication());

module.exports = {
  name: MODULE_NAME,
  run(parameters) {
    const [rawQuantity] = parameters;
    const quantity = Number.parseInt(rawQuantity, 10) || QuantityLimit.MIN;

    if (quantity > QuantityLimit.MAX) {
      console.error(`Не больше ${ QuantityLimit.MAX } публикаций`);

      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(generatePublications(quantity));

    fs.writeFile(FILE_NAME, content, (error) => {
      if (error) {
        console.error(`Не получилось записать данные в файл...`);

        return process.exit(ExitCode.ERROR);
      }

      return console.info(`Файл с данными успешно создан.`);
    });
  }
}
