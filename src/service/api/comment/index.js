'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../../constants`);
const {isRequestDataValid} = require(`../../middlewares/is-request-data-valid`);
const {isRequestParamsValid} = require(`../../middlewares/is-request-params-valid`);
const {isUserAuthorized} = require(`../../middlewares/is-user-authorized`);
const {isCommentBelongsToUser} = require(`../../middlewares/is-comment-belongs-to-user`);
const {isCommentExists} = require(`../../middlewares/is-comment-exist`);
const {commentSchema} = require(`../../schema/comment-data`);
const {commentParamsSchema} = require(`../../schema/comment-params`);
const {Route} = require(`./constants`);

const createCommentRouter = ({commentService, logger}) => {
  const router = new Router({mergeParams: true});

  const isRequestParamsValidMiddleware = isRequestParamsValid({schema: commentParamsSchema, logger});
  const isRequestDataValidMiddleware = isRequestDataValid({schema: commentSchema, logger});
  const isUserAuthorizedMiddleware = isUserAuthorized({logger});
  const isCommentExistsMiddleware = isCommentExists({logger, service: commentService});
  const isCommentBelongsToUserMiddleware = isCommentBelongsToUser({logger, service: commentService});

  router.get(Route.INDEX, async (req, res, next) => {
    const {articleId} = req.params;

    try {
      const comments = await commentService.findAll(articleId);

      res.status(HttpStatusCode.OK).json(comments);
    } catch (error) {
      next(error);
    }
  });

  router.post(Route.INDEX, [isUserAuthorizedMiddleware, isRequestDataValidMiddleware], async (req, res, next) => {
    const {articleId} = req.params;
    const {userId} = res.locals;
    const {text} = req.body;

    try {
      const newComment = await commentService.create({articleId, userId, text});

      res.status(HttpStatusCode.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  });

  router.delete(Route.COMMENT, [
    isUserAuthorizedMiddleware,
    isRequestParamsValidMiddleware,
    isCommentExistsMiddleware,
    isCommentBelongsToUserMiddleware,
  ], async (req, res, next) => {
    const {commentId} = req.params;

    try {
      const deletedComment = await commentService.delete(commentId);

      return res.status(HttpStatusCode.OK).json(deletedComment);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

exports.createCommentRouter = createCommentRouter;
