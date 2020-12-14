'use strict';

const {Router} = require(`express`);

const {getMain, getSearch} = require(`../controllers/main`);
const {getAllCategories} = require(`../middlewares/get-all-categories`);
const {getArticlesWithPagination} = require(`../middlewares/get-articles-with-pagination`);

const router = new Router();

router.get(`/`, [getAllCategories, getArticlesWithPagination], getMain);
router.get(`/search`, getSearch);

module.exports = router;
