'use strict';

const {createUserModel, createUserAssociations} = require(`./user`);
const {createArticleModel, createArticleAssociations} = require(`./article`);
const {createCategoryModel, createCategoryAssociations} = require(`./category`);
const {createCommentModel, createCommentAssociations} = require(`./comment`);
const {createRefreshTokenModel} = require(`./refresh-token`);

module.exports.createModels = (sequelize) => {
  const DataTypes = sequelize.Sequelize.DataTypes;

  const User = createUserModel(sequelize, DataTypes);
  const Article = createArticleModel(sequelize, DataTypes);
  const Category = createCategoryModel(sequelize, DataTypes);
  const Comment = createCommentModel(sequelize, DataTypes);
  const RefreshToken = createRefreshTokenModel(sequelize, DataTypes);

  createUserAssociations({Article, User, Comment});
  createArticleAssociations({Article, Category, User, Comment});
  createCategoryAssociations({Article, Category});
  createCommentAssociations({Comment, Article, User});

  return {
    User,
    Article,
    Category,
    Comment,
    RefreshToken,
  };
};
