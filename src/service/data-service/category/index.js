'use strict';

class CategoryService {
  findAll(articles) {
    const categories = articles.reduce((accumulator, {category}) => accumulator.add(...category), new Set());

    return [...categories];
  }
}

exports.CategoryService = CategoryService;
