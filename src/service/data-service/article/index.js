'use strict';

class ArticleService {
  constructor(dataBase, logger) {
    const {models} = dataBase;
    const {Category, Comment} = models;

    this._dataBase = dataBase;
    this._models = models;
    this._logger = logger;
    this._selectOptions = {
      include: [
        {
          model: Category,
          attributes: [
            `id`,
            `title`,
          ],
          through: {
            attributes: [],
          },
        },
        {
          model: Comment,
          as: `comments`,
          attributes: [
            `id`,
            `message`,
            [`created_date`, `createdDate`],
          ],
        },
      ],
      attributes: [
        `id`,
        `image`,
        `title`,
        `announce`,
        [`text`, `fullText`],
        [`created_date`, `createdDate`],
      ],
      order: [
        [`created_date`, `DESC`],
      ],
    };
  }

  async findAll({offset, limit, categoryId}) {
    const {Article, Category} = this._models;

    try {
      if (categoryId) {
        const articlesWithCategoryId = await Article.findAll({
          include: [
            {
              model: Category,
              where: {
                id: categoryId
              },
            },
          ],
          attributes: [`id`],
          raw: true,
        });

        const articleIdsWithCategoryId = articlesWithCategoryId.map(({id}) => id);

        const articles = await Article.findAll({
          ...this._selectOptions,
          offset,
          limit,
          where: {
            id: articleIdsWithCategoryId,
          }
        });

        return {
          quantity: articleIdsWithCategoryId.length,
          articles,
        };
      }

      const [quantity, articles] = await Promise.all([
        Article.count(),
        Article.findAll({
          ...this._selectOptions,
          offset,
          limit,
        }),
      ]);

      return {
        quantity,
        articles,
      };
    } catch (error) {
      this._logger.error(`Не могу найти публикации. Ошибка: ${ error }`);

      return [];
    }
  }

  async findAllByTitle(title) {
    const {sequelize} = this._dataBase;
    const {Article} = this._models;

    try {
      return Article.findAll({
        ...this._selectOptions,
        where: {
          title: {
            [sequelize.Sequelize.Op.iLike]: `%${ title }%`,

          },
        },
      });
    } catch (error) {
      this._logger.error(`Не могу найти публикацию с заголовком: ${ title }. Ошибка: ${ error }`);

      return null;
    }
  }

  async findById(id) {
    const {Article} = this._models;
    const articleId = Number.parseInt(id, 10);

    try {
      return Article.findByPk(articleId, this._selectOptions);
    } catch (error) {
      this._logger.error(`Не могу найти публикацию с id: ${ articleId }. Ошибка: ${ error }`);

      return null;
    }
  }

  async isExists(id) {
    const {Article} = this._models;
    const articleId = Number.parseInt(id, 10);

    try {
      const article = await Article.findByPk(articleId);

      return !!article;
    } catch (error) {
      this._logger.error(`Не могу проверить наличие публикации с id: ${ articleId }. Ошибка: ${ error }`);

      return false;
    }
  }

  async create({image, title, announce, fullText, categories: categoriesIds, userId}) {
    const {sequelize} = this._dataBase;
    const {Article, Category, User} = this._models;

    try {
      const user = await User.findByPk(userId);

      const newArticle = await user.createArticle({
        image,
        title,
        announce,
        text: fullText,
      });

      const categories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        },
      });

      await newArticle.addCategories(categories);

      return Article.findByPk(newArticle.id, this._selectOptions);
    } catch (error) {
      this._logger.error(`Не могу создать публикацию. Ошибка: ${ error }`);

      return null;
    }
  }

  async update({id, image, title, announce, fullText, categories: categoriesIds}) {
    const {sequelize} = this._dataBase;
    const {Article, Category} = this._models;

    try {
      const [updatedRows] = await Article.update({
        image,
        title,
        announce,
        text: fullText,
      }, {
        where: {
          id,
        },
      });

      if (!updatedRows) {
        return null;
      }

      const updatedArticle = await Article.findByPk(id);

      const categories = await Category.findAll({
        where: {
          id: {
            [sequelize.Sequelize.Op.or]: categoriesIds,
          },
        },
      });

      await updatedArticle.setCategories(categories);

      return Article.findByPk(updatedArticle.id, this._selectOptions);
    } catch (error) {
      this._logger.error(`Не могу обновить публикацию. Ошибка: ${ error }`);

      return null;
    }
  }

  async delete(id) {
    const {Article} = this._models;

    try {
      const deletedArticle = await Article.findByPk(id, this._selectOptions);
      const deletedRows = await Article.destroy({
        where: {
          id,
        },
        ...this._selectOptions,
      });

      if (!deletedRows) {
        return null;
      }

      return deletedArticle;
    } catch (error) {
      this._logger.error(`Не могу удалить публикацию. Ошибка: ${ error }`);

      return null;
    }
  }

  async isArticleBelongsToUser(offerId, userId) {
    const {Article} = this._models;

    try {
      const article = await Article.findByPk(offerId, {
        raw: true,
        attributes: [
          `id`,
          [`user_id`, `userId`],
        ],
      });

      return article.userId === userId;
    } catch (error) {
      this._logger.error(`Не могу проверить кому принадлежит публикация. Ошибка: ${ error }`);

      return false;
    }
  }
}

exports.ArticleService = ArticleService;
