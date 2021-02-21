'use strict';

class CategoryService {
  constructor(dataBase, logger) {
    const {sequelize, models} = dataBase;
    const {Article} = models;

    this._dataBase = dataBase;
    this._models = models;
    this._logger = logger;
    this._selectOptions = {
      attributes: {
        include: [[sequelize.fn(`COUNT`, sequelize.col(`articles.id`)), `quantity`]]
      },
      include: {
        model: Article,
        attributes: []
      },
      group: [`category.id`, `category.created_date`],
      order: [
        [sequelize.col(`created_date`), `ASC`],
      ],
      includeIgnoreAttributes: false,
      raw: true,
    };
  }

  async findAll() {
    const {Category} = this._models;

    try {
      return Category.findAll(this._selectOptions);
    } catch (error) {
      this._logger.error(`Не могу найти категории. Ошибка: ${ error }`);

      return null;
    }
  }

  async findById(id) {
    const {Category} = this._models;

    try {
      return Category.findByPk(id, this._selectOptions);
    } catch (error) {
      this._logger.error(`Не могу найти категорию с id = ${id}. Ошибка: ${ error }`);

      return null;
    }
  }

  async create(params) {
    const {Category} = this._models;

    try {
      const {id} = await Category.create(params);

      return Category.findByPk(id, this._selectOptions);
    } catch (error) {
      this._logger.error(`Не могу создать категорию. Ошибка: ${error}`);

      return null;
    }
  }

  async update({id, title}) {
    const {Category} = this._models;

    try {
      const [updatedRows] = await Category.update({
        title,
      }, {
        where: {
          id,
        },
      });

      if (!updatedRows) {
        return null;
      }

      return Category.findByPk(id, this._selectOptions);
    } catch (error) {
      this._logger.error(`Не могу обновить категорию. Ошибка: ${ error }`);

      return null;
    }
  }

  async isExists(id) {
    try {
      const category = await this.findById(id);

      return !!category;
    } catch (error) {
      this._logger.error(`Не могу проверить наличие категории с id: ${ id }. Ошибка: ${ error }`);

      return false;
    }
  }

  async delete(id) {
    const {Category} = this._models;

    try {
      return Category.destroy({
        where: {
          id,
        },
      });
    } catch (error) {
      this._logger.error(`Не могу удалить категорию с id: ${id}. Ошибка: ${error}`);

      return null;
    }
  }

  async isEmpty(id) {
    try {
      const category = await this.findById(id);
      const quantity = Number.parseInt(category.quantity, 10);

      return !quantity;
    } catch (error) {
      this._logger.error(`Не могу узнать используется ли категория с id: ${id} или нет. Ошибка: ${error}`);

      return null;
    }
  }
}

module.exports.CategoryService = CategoryService;
