'use strict';

const {getRandomInteger} = require(`../../../../utils`);
const {USER_FIRST_NAMES, USER_LAST_NAMES, PasswordRestrict} = require(`./constants`);

exports.createUsers = (count) => Array.from({length: count}, (_, index) => {
  const id = index + 1;
  const firstName = USER_FIRST_NAMES[getRandomInteger(0, USER_FIRST_NAMES.length - 1)];
  const lastName = USER_LAST_NAMES[getRandomInteger(0, USER_LAST_NAMES.length - 1)];
  const email = `${ firstName.eng }_${ lastName.eng }_${ id }@mail.local`.toLowerCase();
  const password = getRandomInteger(PasswordRestrict.MIN, PasswordRestrict.MAX);
  const avatar = `/img/avatar-${ id }.png`;

  return {
    id,
    firstName: firstName.ru,
    lastName: lastName.ru,
    email,
    password,
    avatar,
  };
});
