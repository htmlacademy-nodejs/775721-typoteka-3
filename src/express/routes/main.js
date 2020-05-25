`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.render(`main/main`));
router.get(`/search`, (req, res) => res.render(`main/search`));

module.exports = router;
