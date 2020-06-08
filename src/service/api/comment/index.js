`use strict`;

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../../constants`);
const {isRequestDataValid} = require(`../../middlewares/is-request-data-valid`);
const {Route, EXPECTED_PROPERTIES} = require(`./constants`);

const createCommentRouter = (articleService, commentService) => {
  const router = new Router({mergeParams: true});

  router.get(Route.INDEX, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findById(articleId);
    const comments = commentService.findAll(article);

    res.status(HttpStatusCode.OK).json(comments);
  });

  router.post(Route.INDEX, isRequestDataValid(EXPECTED_PROPERTIES), (req, res) => {
    const {articleId} = req.params;
    const {text} = req.body;
    const article = articleService.findById(articleId);
    const newComment = commentService.create(article, text);

    res.status(HttpStatusCode.CREATED).json(newComment);
  });

  router.delete(Route.COMMENT, (req, res) => {
    const {articleId, commentId} = req.params;
    const article = articleService.findById(articleId);
    const deletedComment = commentService.delete(article, commentId);

    if (!deletedComment) {
      return res.status(HttpStatusCode.NOT_FOUND).send(`Комментарий с id: ${ commentId } не найден`);
    }

    res.status(HttpStatusCode.OK).json(deletedComment);
  });

  return router;
};

exports.createCommentRouter = createCommentRouter;
