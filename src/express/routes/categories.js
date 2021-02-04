'use strict';

const {Router} = require(`express`);

const {getCategories, postCategories, postEditCategory} = require(`../controllers/categories`);
const {getAllCategories} = require(`../middlewares/get-all-categories`);

const router = new Router();

router.get(`/`, [getAllCategories], getCategories);
router.post(`/`, postCategories);
router.post(`/edit/:id`, postEditCategory);

module.exports = router;
