`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/login`, (req, res) => res.send(`/login`));
router.get(`/register`, (req, res) => res.send(`/register`));

module.exports = router;
