'use strict';

const {Router} = require(`express`);

const {getAddArticle, postAddArticle, getEditArticle} = require(`../controllers/articles`);
const {isUserHasAccess} = require(`../middlewares/is-user-has-access`);

const router = new Router();

router.get(`/add`, [isUserHasAccess], getAddArticle);
router.post(`/add`, [isUserHasAccess], postAddArticle);
router.get(`/:id`, (req, res) => res.render(`articles/post`));
router.get(`/edit/:id`, [isUserHasAccess], getEditArticle);
router.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

module.exports = router;
