'use strict';

const {Router} = require(`express`);

const router = new Router();

router.get(`/add`, (req, res) => res.render(`articles/new-post`));
router.get(`/:id`, (req, res) => res.render(`articles/post`));
router.get(`/edit/:id`, (req, res) => res.render(`articles/new-post`));
router.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

module.exports = router;
