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

  async create(articleId, text) {
    const {Article, Comment} = this._models;

    try {
      const article = await Article.findByPk(articleId);

      const newComment = await article.createComment({
        message: text,
        user_id: 1, /* eslint-disable-line */
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
}

exports.CommentService = CommentService;
