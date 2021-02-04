'use strict';

const {Router} = require(`express`);

const {getCategories, postCategories, postEditCategory, getDeleteCategory} = require(`../controllers/categories`);
const {getAllCategories} = require(`../middlewares/get-all-categories`);

const router = new Router();

router.get(`/`, [getAllCategories], getCategories);
router.post(`/`, postCategories);
router.post(`/edit/:id`, postEditCategory);
router.get(`/delete/:id`, getDeleteCategory);

module.exports = router;
