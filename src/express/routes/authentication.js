'use strict';

const {Router} = require(`express`);

const {getRegister, postRegister} = require(`../controllers/authentication`);

const router = new Router();

router.get(`/login`, (req, res) => res.render(`authentication/login`));
router.get(`/register`, getRegister);
router.post(`/register`, postRegister);

module.exports = router;
