'use strict';

const {Router} = require(`express`);

const {createArticleRouter} = require(`./article`);
const {createCategoryRouter} = require(`./category`);
const {createSearchRouter} = require(`./search`);
const {createUserRouter} = require(`./user`);
const {createCommentRouter} = require(`./comment`);


const createRouter = ({articleService, commentService, categoryService, userService, refreshTokenService, logger}) => {
  const router = new Router();

  const articleRouter = createArticleRouter({articleService, userService, logger});
  const categoryRouter = createCategoryRouter({categoryService, userService, logger});
  const searchRouter = createSearchRouter(articleService);
  const userRouter = createUserRouter({userService, refreshTokenService, logger});
  const commentRouter = createCommentRouter({commentService, articleService, userService, logger});

  router.use(`/articles`, articleRouter);
  router.use(`/categories`, categoryRouter);
  router.use(`/search`, searchRouter);
  router.use(`/user`, userRouter);
  router.use(`/comments`, commentRouter);

  return router;
};

exports.createRouter = createRouter;
