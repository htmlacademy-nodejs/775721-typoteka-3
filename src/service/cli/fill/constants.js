'use strict';

module.exports = {
  MODULE_NAME: `--fill`,
  FILE_NAME: `fill-db.sql`,
  USERS_QUANTITY: 2,
  EntityKeyToEntityPropertiesOrder: {
    users: [`id`, `firstName`, `lastName`, `email`, `password`, `avatar`],
    categories: [`id`, `title`],
    articles: [`id`, `userId`, `image`, `createdDate`, `title`, `announce`, `text`],
    [`articles_categories`]: [`articleId`, `categoryId`],
    comments: [`id`, `userId`, `articleId`, `createdDate`, `message`],
  },
};
