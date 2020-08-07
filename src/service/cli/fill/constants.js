'use strict';

module.exports = {
  MODULE_NAME: `--fill`,
  FILE_NAME: `fill-db.sql`,
  USERS_QUANTITY: 2,
  EntityKeyToEntityPropertiesOrder: {
    users: [`id`, `firstName`, `lastName`, `email`, `password`, `avatar`],
    categories: [`id`, `title`],
    articles: [`id`, `image`, `title`, `announce`, `text`, `created_date`, `user_id`],
    [`articles_categories`]: [`article_id`, `category_id`],
    comments: [`id`, `message`, `created_date`, `user_id`, `article_id`],
  },
};
