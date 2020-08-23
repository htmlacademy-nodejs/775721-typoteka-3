'use strict';

exports.fillDataBase = async ({dataBase, mocks}) => {
  const {sequelize, models} = dataBase;
  const {User, Category, Article, Comment} = models;
  const {users = [], categories = [], articles = [], comments = [], articlesCategories = []} = mocks;

  try {
    await sequelize.sync({force: true});

    await Promise.all([
      User.bulkCreate(users),
      Category.bulkCreate(categories),
    ]);

    await Article.bulkCreate(articles);
    await Comment.bulkCreate(comments);

    const addCategoryPromises = articlesCategories.map(async ({articleId, categoriesIds}) => {
      const article = await Article.findByPk(articleId);
      const articleCategories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        },
      });

      await article.addCategories(articleCategories);
    });

    await Promise.all(addCategoryPromises);

    await dataBase.sequelize.query(`ALTER SEQUENCE articles_id_seq RESTART WITH 1453`);
  } catch (error) {
    console.log(`Не могу заполнить базу данных. Ошибка: ${ error }`);
  }
};
