'use strict';

const bcrypt = require(`bcrypt`);

const {USER_FIRST_NAMES, USER_LAST_NAMES, DEFAULT_PASSWORD} = require(`./constants`);
const {PASSWORD_SALT_ROUNDS} = require(`../../../../config`);
const {getRandomInteger} = require(`../../../utils`);
const {UserRole} = require(`../../../../constants`);

const saltRounds = parseInt(PASSWORD_SALT_ROUNDS, 10);

module.exports.createUsers = async (count) => {
  const createUserPromises = Array.from({length: count}, async (_, index) => {
    const id = index + 1;
    const isAdmin = index === 0;
    const firstName = USER_FIRST_NAMES[getRandomInteger(0, USER_FIRST_NAMES.length - 1)];
    const lastName = USER_LAST_NAMES[getRandomInteger(0, USER_LAST_NAMES.length - 1)];
    const email = `${ firstName.eng }_${ lastName.eng }_${ id }@mail.com`.toLowerCase();
    const avatar = `avatar-${ id }.png`;
    const role = isAdmin ? UserRole.ADMIN : UserRole.READER;
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, saltRounds);

    return {
      id,
      firstName: firstName.ru,
      lastName: lastName.ru,
      email,
      password: passwordHash,
      avatar,
      role,
    };
  });

  return Promise.all(createUserPromises);
};
