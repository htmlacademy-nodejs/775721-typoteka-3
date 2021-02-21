'use strict';

const {Router} = require(`express`);

const {isQueryRequestParamsValid} = require(`../../middlewares/is-query-params-valid`);
const {isArticleExists} = require(`../../middlewares/is-article-exists`);
const {isUserAuthorized} = require(`../../middlewares/is-user-authorized`);
const {isRequestDataValid} = require(`../../middlewares/is-request-data-valid`);
const {isRequestParamsValid} = require(`../../middlewares/is-request-params-valid`);
const {isAdmin} = require(`../../middlewares/is-admin`);
const {isCommentExists} = require(`../../middlewares/is-comment-exist`);
const {isUserExists} = require(`../../middlewares/is-user-exists`);
const {getResponseCommentQueryParamsSchema} = require(`../../schema/get-response-comment-query-params-schema`);
const {commentSchema} = require(`../../schema/comment-data`);
const {commentParamsSchema} = require(`../../schema/comment-params`);
const {HttpStatusCode} = require(`../../../constants`);

const createCommentRouter = ({commentService, articleService, userService, logger}) => {
  const router = new Router({mergeParams: true});

  const isGetRequestQueryParamsValidMiddleware = isQueryRequestParamsValid({schema: getResponseCommentQueryParamsSchema, logger});
  const isArticleExistsMiddleware = isArticleExists({service: articleService, logger});
  const isUserAuthorizedMiddleware = isUserAuthorized({logger});
  const isRequestDataValidMiddleware = isRequestDataValid({schema: commentSchema, logger});
  const isRequestParamsValidMiddleware = isRequestParamsValid({schema: commentParamsSchema, logger});
  const isCommentExistsMiddleware = isCommentExists({logger, service: commentService});
  const isUserExistsMiddleware = isUserExists({logger, service: userService});
  const isAdminMiddleware = isAdmin({userService, logger});

  router.get(`/`, [
    isGetRequestQueryParamsValidMiddleware,
    isArticleExistsMiddleware,
    isUserExistsMiddleware
  ], async (req, res, next) => {
    try {
      const comments = await commentService.findAll(req.query);

      res.status(HttpStatusCode.OK).json(comments);
    } catch (error) {
      next(error);
    }
  });

  router.post(`/`, [
    isUserAuthorizedMiddleware,
    isRequestDataValidMiddleware,
    isArticleExistsMiddleware
  ], async (req, res, next) => {
    const {userId} = res.locals;
    const {text, articleId} = req.body;

    try {
      const newComment = await commentService.create({articleId, userId, text});

      res.status(HttpStatusCode.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  });

  router.delete(`/:commentId`, [
    isUserAuthorizedMiddleware,
    isAdminMiddleware,
    isRequestParamsValidMiddleware,
    isCommentExistsMiddleware,
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
