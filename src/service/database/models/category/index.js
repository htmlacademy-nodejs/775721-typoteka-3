'use strict';

const {CategoryTitleRequirements} = require(`./constants`);

exports.createCategoryModel = (sequelize, DataTypes) => {
  class Category extends sequelize.Sequelize.Model {
  }

  Category.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(CategoryTitleRequirements.length.MAX), /* eslint-disable-line */
      allowNull: false,
      validate: {
        len: [CategoryTitleRequirements.length.MIN, CategoryTitleRequirements.length.MAX],
      },
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    modelName: `category`,
  });

  return Category;
};

exports.createCategoryAssociations = ({Category, Article}) => {
  Category.belongsToMany(Article, {
    through: `articles_categories`,
    foreignKey: `category_id`,
    timestamps: false,
    paranoid: false,
  });
};
