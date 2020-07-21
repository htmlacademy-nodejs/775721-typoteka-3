'use strict';

const {createRandomCategories} = require(`../../../utils/create-random-categories`);

exports.createArticlesCategories = ({articles, categories}) =>
  articles.reduce((articlesCategories, {id: articleId}) => {
    const categoryNames = createRandomCategories(categories);
    const currentArticleCategories = categoryNames.map(({id: categoryId}) => ({
      articleId,
      categoryId,
    }));

    return [...articlesCategories, ...currentArticleCategories];

  }, []);
