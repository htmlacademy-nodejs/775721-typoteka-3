'use strict';

const parseArticleFormFields = (req, res, next) => {
  const {createdDate, title, announce, fullText, ...categoriesObject} = req.fields;
  const {imageName} = res.locals;
  const categories = Object.values(categoriesObject);
  const article = {
    title,
    announce,
    categories,
  };

  if (createdDate) {
    article.createdDate = new Date(createdDate).toISOString();
  }

  if (fullText) {
    article.fullText = fullText;
  }

  if (imageName) {
    article.image = imageName;
  }

  res.locals.article = article;

  return next();
};

exports.parseArticleFormFields = parseArticleFormFields;
