'use strict';

const chalk = require(`chalk`);

const {getMockContent} = require(`../get-mock-content`);
const {FilePath} = require(`../../../../constants`);

module.exports.createCategories = async () => {
  let categories = [];

  try {
    const [categoryNames] = await getMockContent([FilePath.CATEGORIES]);

    categories = categoryNames.map((name, index) => {
      const id = index + 1;

      return {
        id,
        title: name,
      };
    });
  } catch (error) {
    console.error(chalk.red(`Не могу создать категории`));
  }

  return categories;
};
