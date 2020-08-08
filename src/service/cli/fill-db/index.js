'use strict';

const chalk = require(`chalk`);

const dataBase = require(`../../database`);
const {fillDataBase} = require(`../../database/fill-data-base`);
const {createUsers} = require(`../utils/create-users`);
const {createCategories} = require(`../utils/create-categories`);
const {createArticles} = require(`../utils/create-articles`);
const {createComments} = require(`../utils/create-comments`);
const {createArticlesCategories} = require(`../utils/create-articles-categories`);
const {flattenArticlesCategories} = require(`../utils/flatten-articles-categories`);
const {ExitCode} = require(`../../../constants`);
const {QuantityLimit} = require(`../constants`);
const {USERS_COUNT, MODULE_NAME} = require(`./constants`);

module.exports = {
  name: MODULE_NAME,
  async run(args) {
    const {sequelize} = dataBase;
    const [rawQuantity] = args;

    const quantity = Number.parseInt(rawQuantity, 10) || QuantityLimit.MIN;

    if (quantity > QuantityLimit.MAX) {
      console.error(chalk.red(`Не больше ${ QuantityLimit.MAX } публикаций.`));

      process.exit(ExitCode.ERROR);
    }

    if (quantity < 0) {
      console.error(chalk.red(`Не могу создать ${ quantity } публикаций.`));

      process.exit(ExitCode.ERROR);
    }

    try {
      console.info(chalk.green(`Попытка подключения к базе данных`));

      const result = await sequelize.sync();

      console.info(chalk.green(`Успешное подключение к базе данных ${ result.config.database }`));
    } catch (error) {
      console.error(chalk.red(`Не удалось подключиться к базе данных. Ошибка: ${ error }`));

      process.exit(ExitCode.ERROR);
    }

    try {
      const users = createUsers(USERS_COUNT);
      const categories = await createCategories();
      const articles = await createArticles({quantity, users});
      const comments = await createComments({users, articles});
      const articlesCategories = flattenArticlesCategories(createArticlesCategories({articles, categories}));

      await fillDataBase({
        dataBase,
        mocks: {
          users,
          categories,
          articles,
          comments,
          articlesCategories,
        },
      });

      sequelize.close();
    } catch (error) {
      console.log(chalk.red(`Не могу заполнить базу данных. Ошибка: ${ error }`));
    }

    console.info(chalk.green(`База данных успешно заполнена.`));
  },
};
