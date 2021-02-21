'use strict';

const {CommentMessageRequirements} = require(`./constants`);

module.exports.createCommentModel = (sequelize, DataTypes) => {
  class Comment extends sequelize.Sequelize.Model {
  }

  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(300), /* eslint-disable-line */
      allowNull: false,
      validate: {
        len: [CommentMessageRequirements.length.MIN, CommentMessageRequirements.length.MAX],
      },
    },
  }, {
    sequelize,
    createdAt: `created_date`,
    updatedAt: false,
    paranoid: false,
    modelName: `comment`,
  });

  return Comment;
};

module.exports.createCommentAssociations = ({Comment, Article, User}) => {
  Comment.belongsTo(User, {
    foreignKey: `user_id`,
  });

  Comment.belongsTo(Article, {
    foreignKey: `article_id`,
  });
};
