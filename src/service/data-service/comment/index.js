`use strict`;

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  findAll(articles) {
    return articles.comments;
  };

  create(article, text) {
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      text,
    };

    article.comments.push(newComment);

    return newComment;
  }

  delete(article, commentId) {
    const deletedComment = article.comments.find(({id}) => id === commentId);

    if (!deletedComment) {
      return null;
    }

    article.comments = article.comments.filter(({id}) => id !== commentId);

    return deletedComment;
  };
}

exports.CommentService = CommentService;
