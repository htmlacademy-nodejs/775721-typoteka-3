'use strict';

const {Router} = require(`express`);

const {getAddArticle, postAddArticle, getEditArticle, getArticlesByCategory, getArticle, postComment, getDeleteArticle} = require(`../controllers/articles`);
const {isAuthorizedUser} = require(`../middlewares/is-authorized-user`);
const {getAllCategories} = require(`../middlewares/get-all-categories`);
const {getArticlesWithPagination} = require(`../middlewares/get-articles-with-pagination`);
const {isAdmin} = require(`../middlewares/is-admin`);

const router = new Router();

router.get(`/add`, [isAdmin, getAllCategories], getAddArticle);
router.post(`/add`, [isAdmin], postAddArticle);
router.get(`/:id`, [getAllCategories], getArticle);
router.post(`/:id/comments`, [isAuthorizedUser], postComment);
router.get(`/edit/:id`, [isAdmin, getAllCategories], getEditArticle);
router.get(`/delete/:id`, [isAdmin], getDeleteArticle);
router.get(`/category/:categoryId`, [getAllCategories, getArticlesWithPagination], getArticlesByCategory);

module.exports = router;
