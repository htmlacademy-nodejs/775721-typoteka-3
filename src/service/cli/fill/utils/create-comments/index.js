'use strict';

const {createRandomDate} = require(`../../../utils/create-random-date`);
const {createRandomText} = require(`../../../utils/create-random-text`);
const {getRandomInteger} = require(`../../../../utils`);
const {CommentsQuantityLimit} = require(`./constants`);
const {CommentTextSentencesLimit} = require(`../../../constants`);

exports.createComments = ({users, articles, messages}) => articles.reduce((articlesComments, {id: articleId}) => {
  const numberOfComments = getRandomInteger(CommentsQuantityLimit.MIN, CommentsQuantityLimit.MAX);
  const currentArticlesComments = Array.from({length: numberOfComments}, (_, index) => {
    const lastArticle = articlesComments[articlesComments.length - 1];
    const lastIndex = lastArticle ? lastArticle.id : 0;
    const id = lastIndex + index + 1;

    const user = users[getRandomInteger(0, users.length - 1)];

    const userId = user && user.id;
    const message = createRandomText(messages, {
      min: CommentTextSentencesLimit.MIN,
      max: CommentTextSentencesLimit.MAX,
    });
    const createdDate = createRandomDate();

    return {
      id,
      userId,
      articleId,
      createdDate,
      message,
    };
  });

  return [...articlesComments, ...currentArticlesComments];
}, []);
