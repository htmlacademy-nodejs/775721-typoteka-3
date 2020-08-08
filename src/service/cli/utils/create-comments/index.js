'use strict';

const chalk = require(`chalk`);

const {getMockContent} = require(`../get-mock-content`);
const {createRandomDate} = require(`../create-random-date`);
const {createRandomText} = require(`../create-random-text`);
const {getRandomInteger} = require(`../../../utils`);
const {CommentsQuantityLimit} = require(`./constants`);
const {CommentTextSentencesLimit} = require(`../../constants`);
const {FilePath} = require(`../../../../constants`);

exports.createComments = async ({users, articles}) => {
  let comments = [];

  try {
    const [messages] = await getMockContent([FilePath.COMMENTS]);

    comments = articles.reduce((articlesComments, {id: articleId}) => {
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
          message,
          [`user_id`]: userId,
          [`article_id`]: articleId,
          [`created_date`]: createdDate,
        };
      });

      return [...articlesComments, ...currentArticlesComments];
    }, []);
  } catch (error) {
    console.error(chalk.red(`Не могу создать комментарии`));
  }

  return comments;
};
