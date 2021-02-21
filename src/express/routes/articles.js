'use strict';

const {Router} = require(`express`);

const {getAddArticle, postAddArticle, getEditArticle, getArticlesByCategory, getArticle, postComment, getDeleteArticle, postEditArticle} = require(`../controllers/articles`);
const {isAuthorizedUser} = require(`../middlewares/is-authorized-user`);
const {getAllCategories} = require(`../middlewares/get-all-categories`);
const {getArticlesWithPagination} = require(`../middlewares/get-articles-with-pagination`);
const {isAdmin} = require(`../middlewares/is-admin`);
const {saveImage} = require(`../middlewares/save-image`);
const {parseArticleFormFields} = require(`../middlewares/parse-article-fields`);

const router = new Router();
const savePhotoMiddleware = saveImage(`photo`);

router.get(`/add`, [isAdmin, getAllCategories], getAddArticle);
router.post(`/add`, [isAdmin, savePhotoMiddleware, parseArticleFormFields], postAddArticle);
router.get(`/:id`, [getAllCategories], getArticle);
router.post(`/:id/comments`, [isAuthorizedUser], postComment);
router.get(`/edit/:id`, [isAdmin, getAllCategories], getEditArticle);
router.post(`/edit/:id`, [isAdmin, savePhotoMiddleware, parseArticleFormFields], postEditArticle);
router.get(`/delete/:id`, [isAdmin], getDeleteArticle);
router.get(`/category/:categoryId`, [getAllCategories, getArticlesWithPagination], getArticlesByCategory);

module.exports = router;
