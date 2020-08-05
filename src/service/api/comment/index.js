'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../../constants`);
const {isRequestDataValid} = require(`../../middlewares/is-request-data-valid`);
const {Route, EXPECTED_PROPERTIES} = require(`./constants`);

const createCommentRouter = ({commentService, logger}) => {
  const router = new Router({mergeParams: true});

  const isRequestDataValidMiddleware = isRequestDataValid({expectedProperties: EXPECTED_PROPERTIES, logger});

  router.get(Route.INDEX, async (req, res, next) => {
    const {articleId} = req.params;

    try {
      const comments = await commentService.findAll(articleId);

      res.status(HttpStatusCode.OK).json(comments);
    } catch (error) {
      next(error);
    }
  });

  router.post(Route.INDEX, isRequestDataValidMiddleware, async (req, res, next) => {
    const {articleId} = req.params;
    const {text} = req.body;

    try {
      const newComment = await commentService.create(articleId, text);

      res.status(HttpStatusCode.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  });

  router.delete(Route.COMMENT, async (req, res, next) => {
    const {commentId} = req.params;

    try {
      const deletedComment = await commentService.delete(commentId);

      if (!deletedComment) {
        return res.status(HttpStatusCode.NOT_FOUND).send(`Комментарий с id: ${ commentId } не найден`);
      }

      return res.status(HttpStatusCode.OK).json(deletedComment);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

exports.createCommentRouter = createCommentRouter;
