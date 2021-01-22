'use strict';

const {Router} = require(`express`);

const {getAddArticle, postAddArticle, getEditArticle, getArticlesByCategory, getArticle, postComment} = require(`../controllers/articles`);
const {isUserHasAccess} = require(`../middlewares/is-user-has-access`);
const {getAllCategories} = require(`../middlewares/get-all-categories`);
const {getArticlesWithPagination} = require(`../middlewares/get-articles-with-pagination`);

const router = new Router();

router.get(`/add`, [isUserHasAccess], getAddArticle);
router.post(`/add`, [isUserHasAccess], postAddArticle);
router.get(`/:id`, [getAllCategories], getArticle);
router.post(`/:id/comments`, [isUserHasAccess], postComment);
router.get(`/edit/:id`, [isUserHasAccess], getEditArticle);
router.get(`/category/:categoryId`, [getAllCategories, getArticlesWithPagination], getArticlesByCategory);

module.exports = router;
