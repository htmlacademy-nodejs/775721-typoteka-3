`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.render(`categories/all-categories`));

module.exports = router;
