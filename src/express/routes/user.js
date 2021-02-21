'use strict';

const {Router} = require(`express`);

const {getUserMain, getUserComments, getDeleteComment} = require(`../controllers/user`);

const router = new Router();

router.get(`/`, getUserMain);
router.get(`/comments`, getUserComments);
router.get(`/delete-comment/:id`, getDeleteComment);

module.exports = router;
