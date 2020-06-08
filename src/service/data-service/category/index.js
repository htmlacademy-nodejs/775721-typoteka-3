`use strict`;

class CategoryService {
  findAll(articles) {
    const categories = articles.reduce((categories, {category}) => categories.add(...category), new Set());

    return [...categories];
  };
}

exports.CategoryService = CategoryService;
