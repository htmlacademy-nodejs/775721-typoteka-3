'use strict';

const {ArticleTitleRequirements, ArticleAnnounceRequirements, ArticleTextRequirements} = require(`./constants`);

exports.createArticleModel = (sequelize, DataTypes) => {
  class Article extends sequelize.Sequelize.Model {
  }

  Article.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
    },
    title: {
      type: DataTypes.STRING(ArticleTitleRequirements.length.MAX), /* eslint-disable-line */
      allowNull: false,
      validate: {
        len: [ArticleTitleRequirements.length.MIN, ArticleTitleRequirements.length.MAX],
      },
    },
    announce: {
      type: DataTypes.STRING(ArticleAnnounceRequirements.length.MAX), /* eslint-disable-line */
      allowNull: false,
      validate: {
        len: [ArticleAnnounceRequirements.length.MIN, ArticleAnnounceRequirements.length.MAX],
      },
    },
    text: {
      type: DataTypes.STRING(ArticleTextRequirements.length.MAX), /* eslint-disable-line */
      allowNull: false,
    },
  }, {
    sequelize,
    createdAt: `created_date`,
    updatedAt: false,
    paranoid: false,
    modelName: `article`,
  });

  return Article;
};

exports.createArticleAssociations = ({Article, User, Category, Comment}) => {
  Article.belongsTo(User, {
    foreignKey: `user_id`,
  });

  Article.belongsToMany(Category, {
    through: `articles_categories`,
    foreignKey: `article_id`,
    timestamps: false,
    paranoid: false,
  });

  Article.hasMany(Comment, {
    as: `comments`,
    foreignKey: `article_id`,
  });
};
