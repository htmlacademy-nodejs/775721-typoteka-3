`use strict`;

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticleService {
  #articles;

  constructor(articles) {
    this.#articles = articles;
  }

  findAll() {
    return this.#articles;
  };

  findAllByTitle(title) {
    return this.#articles.filter((offer) => offer.title.includes(title));
  };

  findById(id) {
    return this.#articles.find((article) => article.id === id);
  };

  isExists(id) {
    return this.#articles.some((article) => article.id === id);
  };

  create({title, announce, fullText, category}) {
    const newArticle = {
      id: nanoid(MAX_ID_LENGTH),
      title,
      announce,
      fullText,
      category,
      comments: [],
    };

    this.#articles.push(newArticle);

    return newArticle;
  }

  update({id, title, announce, fullText, category}) {
    const index = this.#articles.findIndex((offer) => offer.id === id);

    if (index === -1) {
      return null;
    }

    const article = this.#articles[index];
    const updatedArticle = Object.assign(article, {title, announce, fullText, category});

    this.#articles[index] = updatedArticle;

    return updatedArticle;
  }

  delete(id) {
    const deletedArticle = this.findById(id);

    if (!deletedArticle) {
      return null;
    }

    this.#articles = this.#articles.filter((offer) => offer.id !== id);

    return deletedArticle;
  }
}

exports.ArticleService = ArticleService;
