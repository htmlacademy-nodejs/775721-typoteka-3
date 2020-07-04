'use strict';

const {Router} = require(`express`);

const {getMain} = require(`../controllers/main`);

const router = new Router();

router.get(`/`, getMain);
router.get(`/search`, (req, res) => res.render(`main/search`));

module.exports = router;
