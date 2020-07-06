'use strict';

const {Router} = require(`express`);

const {getUserMain, getUserComments} = require(`../controllers/user`);

const router = new Router();

router.get(`/`, getUserMain);
router.get(`/comments`, getUserComments);

module.exports = router;
