`use strict`;

const { Router } = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.render(`user/my`));
router.get(`/comments`, (req, res) => res.render(`user/comments`));

module.exports = router;
