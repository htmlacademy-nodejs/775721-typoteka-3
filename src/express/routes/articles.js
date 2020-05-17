`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/add`, (req, res) => res.send(`/articles/add`));
router.get(`/:id`, (req, res) => res.send(`/articles/:id`));
router.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
router.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));

module.exports = router;
