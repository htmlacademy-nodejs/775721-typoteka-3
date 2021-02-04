'use strict';

const {Router} = require(`express`);

const {getCategories, postCategories} = require(`../controllers/categories`);
const {getAllCategories} = require(`../middlewares/get-all-categories`);

const router = new Router();

router.get(`/`, [getAllCategories], getCategories);
router.post(`/`, postCategories);

module.exports = router;
