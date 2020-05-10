`use strict`;

module.exports = {
  MODULE_NAME: `--generate`,
  FILE_NAME: `mocks.json`,
  FILE_TITLES_PATH: `./data/titles.txt`,
  FILE_CATEGORIES_PATH: `./data/categories.txt`,
  FILE_SENTENCES_PATH: `./data/sentences.txt`,
  QuantityLimit: {
    MIN: 1,
    MAX: 1000,
  },
  AnnounceSizeLimit: {
    MIN: 1,
    MAX: 5,
  },
  DAY_IN_MILLISECONDS: 86400000,
  DATE_LIMIT_IN_DAYS: 90,
}
