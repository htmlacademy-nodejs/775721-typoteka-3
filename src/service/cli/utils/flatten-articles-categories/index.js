'use strict';

module.exports.flattenArticlesCategories = (articlesCategories) => articlesCategories.reduce((articlesCategoriesAccumulator, articleCategoriesItem) => {
  const articlesCategoriesItemWithSameId = articlesCategoriesAccumulator.find(({articleId}) => articleId === articleCategoriesItem.article_id);
  const categoriesIds = articlesCategoriesItemWithSameId ? articlesCategoriesItemWithSameId.categoriesIds : [];

  const newCategoriesIds = [...categoriesIds, articleCategoriesItem.category_id];
  const newArticleCategoriesItem = {
    articleId: articleCategoriesItem.article_id,
    categoriesIds: newCategoriesIds,
  };

  const filteredAccumulator = articlesCategoriesItemWithSameId ?
    articlesCategoriesAccumulator.filter(({articleId}) => articleId !== articleCategoriesItem.article_id)
    : articlesCategoriesAccumulator;

  return [
    ...filteredAccumulator,
    newArticleCategoriesItem,
  ];
}, []);
