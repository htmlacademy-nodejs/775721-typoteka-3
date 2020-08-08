'use strict';

const {createRandomCategories} = require(`../create-random-categories`);

exports.createArticlesCategories = ({articles, categories}) =>
  articles.reduce((articlesCategories, {id: articleId}) => {
    const categoryNames = createRandomCategories(categories);
    const currentArticleCategories = categoryNames.map(({id: categoryId}) => ({
      [`article_id`]: articleId,
      [`category_id`]: categoryId,
    }));

    return [...articlesCategories, ...currentArticleCategories];

  }, []);
