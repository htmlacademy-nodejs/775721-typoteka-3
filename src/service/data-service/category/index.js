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
      group: [`category.id`],
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
}

exports.CategoryService = CategoryService;
