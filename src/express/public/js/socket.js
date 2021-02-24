`use strict`;

const LastCommentsElementClassName = {
  SECTION: 'main-page__last',
  EMPTY_MESSAGE: 'last__empty',
  LIST: 'last__list',
  COMMENT: 'last__list-item',
  USER_IMAGE: 'last__list-image',
  USER_NAME: 'last__list-name',
  COMMENT_LINK: 'last__list-link',
};

const HotArticlesElementClassName = {
  SECTION: 'main-page__hot',
  LIST: 'hot__list',
  ARTICLE: 'hot__list-item',
  ARTICLE_LINK: 'hot__list-link',
  COMMENTS_COUNTER: 'hot__link-sup',
  EMPTY_MESSAGE: 'hot__empty',
};

const EMPTY_MESSAGE_TEXT = 'Здесь пока ничего нет...';

const socket = io('http://localhost:3000');

function createCommentElement({id, user, articleId, message}) {
  const fullUserName = `${user.firstName} ${user.lastName}`;

  const commentElement = document.createElement('li');
  commentElement.classList.add(LastCommentsElementClassName.COMMENT);

  const userImageElement = document.createElement('img');
  userImageElement.classList.add(LastCommentsElementClassName.USER_IMAGE);
  userImageElement.src = `img/${user.avatar}`;
  userImageElement.alt = `Аватар пользователя: ${fullUserName}`;
  userImageElement.width = 20;
  userImageElement.height = 20;

  const userNameElement = document.createElement('b');
  userNameElement.classList.add(LastCommentsElementClassName.USER_NAME);
  userNameElement.textContent = fullUserName;

  const commentLinkElement = document.createElement('a');
  commentLinkElement.href = `/articles/${articleId}?previousUrl=/#comment-${id}`;
  commentLinkElement.textContent = message;

  commentElement.append(userImageElement);
  commentElement.append(userNameElement);
  commentElement.append(commentLinkElement);

  return commentElement;
}

function createHotArticleElement({id, title, commentsQuantity}) {
  const articleElement = document.createElement('li');
  articleElement.classList.add(HotArticlesElementClassName.ARTICLE);

  const linkElement = document.createElement('a');
  linkElement.classList.add(HotArticlesElementClassName.ARTICLE_LINK);
  linkElement.href = `/articles/${id}?previousUrl=/`;
  linkElement.textContent = title;

  const commentsCounter = document.createElement('sup');
  commentsCounter.classList.add(HotArticlesElementClassName.COMMENTS_COUNTER);
  commentsCounter.textContent = commentsQuantity;

  linkElement.append(commentsCounter);
  articleElement.append(linkElement);

  return articleElement;
}

function createListElement(arrayOfElements, className) {
  const hotArticlesListElement = document.createElement('ul');
  hotArticlesListElement.classList.add(className);
  hotArticlesListElement.append(...arrayOfElements);

  return hotArticlesListElement;
}

function lastCommentsUpdatedHandler(comments) {
  const lastCommentsSection = document.querySelector(`.${LastCommentsElementClassName.SECTION}`);
  const emptyMessage = lastCommentsSection.querySelector(`.${LastCommentsElementClassName.EMPTY_MESSAGE}`);
  const commentsList = lastCommentsSection.querySelector(`.${LastCommentsElementClassName.LIST}`);
  const replaceableElement = commentsList || emptyMessage;

  if (!comments.length) {
    const messageElement = document.createElement('p');
    messageElement.classList.add(LastCommentsElementClassName.EMPTY_MESSAGE);
    messageElement.textContent = EMPTY_MESSAGE_TEXT;

    replaceableElement.replaceWith(messageElement);

    return;
  }

  const lastCommentElements = comments.map(createCommentElement);
  const newList = createListElement(lastCommentElements, LastCommentsElementClassName.LIST);

  replaceableElement.replaceWith(newList);
}

function hotArticleUpdatedHandler(articles) {
  const hotArticlesSection = document.querySelector(`.${HotArticlesElementClassName.SECTION}`);
  const emptyMessage = hotArticlesSection.querySelector(`.${HotArticlesElementClassName.EMPTY_MESSAGE}`);
  const hotArticlesList = hotArticlesSection.querySelector(`.${HotArticlesElementClassName.LIST}`);
  const replaceableElement = hotArticlesList || emptyMessage;

  if (!articles.length) {
    const messageElement = document.createElement('p');
    messageElement.classList.add(HotArticlesElementClassName.EMPTY_MESSAGE);
    messageElement.textContent = EMPTY_MESSAGE_TEXT;

    replaceableElement.replaceWith(messageElement);

    return;
  }

  const hotArticlesElements = articles.map(createHotArticleElement);
  const newList = createListElement(hotArticlesElements, HotArticlesElementClassName.LIST);

  replaceableElement.replaceWith(newList);
}

socket.addEventListener(`lastCommentsUpdated`, lastCommentsUpdatedHandler);

socket.addEventListener(`hotArticlesUpdated`, hotArticleUpdatedHandler);
