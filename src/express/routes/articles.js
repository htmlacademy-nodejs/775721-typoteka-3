'use strict';

const {Router} = require(`express`);

const {getAddArticle, postAddArticle, getEditArticle, getArticlesByCategory, getArticle, postComment} = require(`../controllers/articles`);
const {isAuthorizedUser} = require(`../middlewares/is-authorized-user`);
const {getAllCategories} = require(`../middlewares/get-all-categories`);
const {getArticlesWithPagination} = require(`../middlewares/get-articles-with-pagination`);
const {isAdmin} = require(`../middlewares/is-admin`);

const router = new Router();

router.get(`/add`, [isAdmin], getAddArticle);
router.post(`/add`, [isAdmin], postAddArticle);
router.get(`/:id`, [getAllCategories], getArticle);
router.post(`/:id/comments`, [isAuthorizedUser], postComment);
router.get(`/edit/:id`, [isAdmin], getEditArticle);
router.get(`/category/:categoryId`, [getAllCategories, getArticlesWithPagination], getArticlesByCategory);

module.exports = router;
