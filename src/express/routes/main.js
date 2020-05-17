`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.send(`/`));
router.get(`/search`, (req, res) => res.send(`/search`));

module.exports = router;
