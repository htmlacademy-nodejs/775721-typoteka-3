'use strict';

const {Router} = require(`express`);

const {getAddArticle, postAddArticle, getEditArticle} = require(`../controllers/articles`);

const router = new Router();

router.get(`/add`, getAddArticle);
router.post(`/add`, postAddArticle);
router.get(`/:id`, (req, res) => res.render(`articles/post`));
router.get(`/edit/:id`, getEditArticle);
router.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

module.exports = router;
