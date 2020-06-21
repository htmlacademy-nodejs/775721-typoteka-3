'use strict';

const {Router} = require(`express`);

const router = new Router();

router.get(`/login`, (req, res) => res.render(`authentication/login`));
router.get(`/register`, (req, res) => res.render(`authentication/register`));

module.exports = router;
