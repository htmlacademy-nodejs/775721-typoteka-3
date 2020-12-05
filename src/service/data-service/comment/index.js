'use strict';

class CommentService {
  constructor(dataBase, logger) {
    this._dataBase = dataBase;
    this._models = dataBase.models;
    this._logger = logger;
    this._selectOptions = {
      raw: true,
      attributes: [
        `id`,
        `message`,
        `created_date`,
      ],
    };
  }

  async findAll(articleId) {
    const {Article} = this._models;

    try {
      const article = await Article.findByPk(articleId);

      return await article.getComments(this._selectOptions);
    } catch (error) {
      this._logger.error(`Не могу найти комментарии для публикации с id ${ articleId }. Ошибка: ${ error }`);

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

      return await Comment.findByPk(newComment.id, this._selectOptions);
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

  async isCommentBelongToUser(commentId, userId) {
    const {Comment} = this._models;

    try {
      const comment = await Comment.findByPk(commentId, {
        raw: true,
        attributes: [
          `id`,
          [`user_id`, `userId`],
        ],
      });

      return comment.userId === userId;
    } catch (error) {
      this._logger.error(`Не могу проверить кому принадлежит комментарий. Ошибка: ${ error }`);

      return false;
    }
  }
}

exports.CommentService = CommentService;
