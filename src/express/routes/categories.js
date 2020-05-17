`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.send(`/categories`));

module.exports = router;
