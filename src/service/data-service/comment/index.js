'use strict';

class CommentService {
  constructor(dataBase, logger) {
    const {models} = dataBase;
    const {User, Article} = models;

    this._dataBase = dataBase;
    this._models = models;
    this._logger = logger;
    this._selectOptions = {
      include: [
        {
          model: User,
          attributes: [
            `id`,
            `firstName`,
            `lastName`,
            `avatar`,
          ],
        },
        {
          model: Article,
          attributes: [
            `id`,
            `title`,
          ],
        },
      ],
      attributes: [
        `id`,
        `message`,
        [`created_date`, `createdDate`],
        [`article_id`, `articleId`],
      ],
      order: [
        [`created_date`, `DESC`],
      ],
    };
  }

  async findAll(options) {
    const {limit, articleId, userId} = options;
    const {Comment} = this._models;
    let selectOptions = {};

    if (userId) {
      if (!selectOptions.where) {
        selectOptions.where = {};
      }

      selectOptions.where[`user_id`] = userId;
    }

    if (articleId) {
      if (!selectOptions.where) {
        selectOptions.where = {};
      }

      selectOptions.where[`article_id`] = articleId;
    }

    if (limit) {
      selectOptions.limit = limit;
    }

    try {
      return Comment.findAll({
        ...this._selectOptions,
        ...selectOptions,
      });
    } catch (error) {
      this._logger.error(`Не могу найти комментарии. Параметры: ${JSON.stringify(options)}. Ошибка: ${ error }`);

      return null;
    }
  }

  async create({articleId, userId, text}) {
    const {Article, Comment} = this._models;

    try {
      const article = await Article.findByPk(articleId);

      const newComment = await article.createComment({
        message: text,
        [`user_id`]: userId,
      });

      return Comment.findByPk(newComment.id, this._selectOptions);
    } catch (error) {
      this._logger.error(`Не могу создать комментарий для публикации с id ${ articleId }. Ошибка: ${ error }`);

      return null;
    }
  }

  async delete(id) {
    const {Comment} = this._models;

    try {
      const deletedComment = await Comment.findByPk(id, this._selectOptions);
      const deletedRows = await Comment.destroy({
        where: {
          id,
        },
        ...this._selectOptions,
      });

      if (!deletedRows) {
        return null;
      }

      return deletedComment;
    } catch (error) {
      this._logger.error(`Не могу удалить комментарий с id: ${ id }. Ошибка: ${ error }`);

      return null;
    }
  }

  async isExists(id) {
    const {Comment} = this._models;
    const commentId = Number.parseInt(id, 10);

    try {
      const comment = await Comment.findByPk(commentId);

      return !!comment;
    } catch (error) {
      this._logger.error(`Не могу приверить существование комментария. Ошибка: ${ error }`);

      return false;
    }
  }
}

module.exports.CommentService = CommentService;
