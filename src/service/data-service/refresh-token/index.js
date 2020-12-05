'use strict';

class RefreshTokenService {
  constructor(dataBase, logger) {
    this._dataBase = dataBase;
    this._models = dataBase.models;
    this._logger = logger;
  }

  async add(value) {
    const {RefreshToken} = this._models;

    try {
      RefreshToken.create({
        value,
      });
    } catch (error) {
      this._logger.error(`Не могу сохранить токен. Ошибка: ${ error }`);
    }
  }

  async findByValue(value) {
    const {RefreshToken} = this._models;

    try {
      return RefreshToken.findOne({
        where: {
          value,
        },
      });
    } catch (error) {
      this._logger.error(`Не могу найти токен. Ошибка: ${error}`);

      return null;
    }
  }

  async delete(value) {
    const {RefreshToken} = this._models;

    try {
      return RefreshToken.destroy({
        where: {
          value,
        },
      });
    } catch (error) {
      this._logger.error(`Не могу удалить токен. Ошибка: ${error}`);

      return null;
    }
  }
}


exports.RefreshTokenService = RefreshTokenService;
