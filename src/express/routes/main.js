'use strict';

const {Router} = require(`express`);

const {getMain, getSearch} = require(`../controllers/main`);

const router = new Router();

router.get(`/`, getMain);
router.get(`/search`, getSearch);

module.exports = router;
