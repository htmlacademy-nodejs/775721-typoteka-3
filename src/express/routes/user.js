'use strict';

const {Router} = require(`express`);

const { getUserMain } = require(`../controllers/user`);

const router = new Router();

router.get(`/`, getUserMain);
router.get(`/comments`, (req, res) => res.render(`user/comments`));

module.exports = router;
