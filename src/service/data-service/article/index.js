'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return this._articles;
  }

  findAllByTitle(title) {
    return this._articles.filter((offer) => offer.title.includes(title));
  }

  findById(id) {
    return this._articles.find((article) => article.id === id);
  }

  isExists(id) {
    return this._articles.some((article) => article.id === id);
  }

  create({title, announce, fullText, category}) {
    const newArticle = {
      id: nanoid(MAX_ID_LENGTH),
      title,
      announce,
      fullText,
      category,
      comments: [],
    };

    this._articles.push(newArticle);

    return newArticle;
  }

  update({id, title, announce, fullText, category}) {
    const index = this._articles.findIndex((offer) => offer.id === id);

    if (index === -1) {
      return null;
    }

    const article = this._articles[index];
    const updatedArticle = Object.assign(article, {title, announce, fullText, category});

    this._articles[index] = updatedArticle;

    return updatedArticle;
  }

  delete(id) {
    const deletedArticle = this.findById(id);

    if (!deletedArticle) {
      return null;
    }

    this._articles = this._articles.filter((offer) => offer.id !== id);

    return deletedArticle;
  }
}

exports.ArticleService = ArticleService;
