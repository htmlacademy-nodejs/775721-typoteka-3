'use strict';

const bcrypt = require(`bcrypt`);

const {PASSWORD_SALT_ROUNDS} = require(`../../../config`);
const {UserRole} = require(`../../../constants`);

class UserService {
  constructor(dataBase, logger) {
    this._dataBase = dataBase;
    this._models = dataBase.models;
    this._logger = logger;
    this._selectOptions = {
      raw: true,
      attributes: [
        `id`,
        `firstName`,
        `lastName`,
        `email`,
        `password`,
        `avatar`,
        `role`,
      ],
    };
  }

  async create({firstName, lastName, email, password, avatar}) {
    const {User} = this._models;
    const saltRounds = parseInt(PASSWORD_SALT_ROUNDS, 10);

    try {
      const role = await this.hasAdmin() ? UserRole.READER : UserRole.ADMIN;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      return User.create({
        firstName,
        lastName,
        email,
        password: passwordHash,
        avatar,
        role,
      });
    } catch (error) {
      this._logger.error(`Ошибка при создании пользователя: ${ error }`);

      return null;
    }
  }

  async findByEmail(email) {
    const {User} = this._models;

    try {
      return User.findOne({
        ...this._selectOptions,
        where: {
          email,
        },
      });
    } catch (error) {
      this._logger.error(`Пользователь с email: ${ email } не найден. Ошибка: ${ error }`);

      return null;
    }
  }

  async isExist(email) {
    return !!await this.findByEmail(email);
  }

  async findById(id) {
    const {User} = this._models;

    try {
      return User.findByPk(id, this._selectOptions);
    } catch (error) {
      this._logger.error(`Пользователь с id: ${ id } не найден. Ошибка: ${ error }`);

      return null;
    }
  }

  async isUserPasswordCorrect(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  async hasAdmin() {
    const {User} = this._models;

    try {
      const admin = await User.findOne({
        ...this._selectOptions,
        where: {
          role: UserRole.ADMIN,
        },
      });

      return !!admin;
    } catch (error) {
      this._logger.error(`Админ не найден. Ошибка: ${ error }`);

      return null;
    }
  }

  async isUserAdmin(id) {
    try {
      const user = await this.findById(id);

      if (!user) {
        return false;
      }

      return user.role === UserRole.ADMIN;
    } catch (error) {
      this._logger.error(`Не могу проверить роль пользователя. Ошибка: ${ error }`);

      return null;
    }
  }
}

exports.UserService = UserService;
