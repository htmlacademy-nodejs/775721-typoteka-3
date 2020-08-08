'use strict';

const fs = require(`fs`).promises;

const chalk = require(`chalk`);

const {createUsers} = require(`../utils/create-users`);
const {createCategories} = require(`../utils/create-categories`);
const {createComments} = require(`../utils/create-comments`);
const {createArticlesCategories} = require(`../utils/create-articles-categories`);
const {createArticles} = require(`../utils/create-articles`);
const {createCommandsForCreatingDBPrimaryData} = require(`./utils/create-commands-for-creating-db-primary-data`);
const {ExitCode} = require(`../../../constants`);
const {QuantityLimit} = require(`../constants`);
const {MODULE_NAME, FILE_NAME, USERS_QUANTITY, EntityKeyToEntityPropertiesOrder} = require(`./constants`);

module.exports = {
  name: MODULE_NAME,
  async run(args) {
    const [rawQuantity] = args;

    const quantity = Number.parseInt(rawQuantity, 10) || QuantityLimit.MIN;

    if (quantity < 0) {
      console.error(chalk.red(`Не могу создать ${ quantity } публикаций.`));

      process.exit(ExitCode.ERROR);
    }

    if (quantity > QuantityLimit.MAX) {
      console.error(chalk.red(`Не больше ${ QuantityLimit.MAX } публикаций.`));

      process.exit(ExitCode.ERROR);
    }

    try {
      const users = createUsers(USERS_QUANTITY);
      const categories = await createCategories();
      const articles = await createArticles({quantity, users});
      const articlesCategories = createArticlesCategories({articles, categories});
      const comments = await createComments({users, articles});

      const commands = createCommandsForCreatingDBPrimaryData({
        users,
        categories,
        articles,
        [`articles_categories`]: articlesCategories,
        comments,
      }, EntityKeyToEntityPropertiesOrder);

      await fs.writeFile(FILE_NAME, commands);
    } catch (error) {
      console.log(error);
      console.error(chalk.red(`Не получилось записать данные в файл...`));

      process.exit(ExitCode.ERROR);
    }

    console.info(chalk.green(`Операция успешно выполнена. Файл ${ FILE_NAME } успешно создан.`));
  },
};
