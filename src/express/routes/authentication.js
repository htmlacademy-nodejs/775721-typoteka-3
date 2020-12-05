'use strict';

const {Router} = require(`express`);

const {getRegister, postRegister, getLogin, postLogin, getLogout} = require(`../controllers/authentication`);
const {isUserHasAccess} = require(`../middlewares/is-user-has-access`);
const {isUserAuthorized} = require(`../middlewares/is-user-authorized`);

const router = new Router();

router.get(`/register`, [isUserAuthorized], getRegister);
router.post(`/register`, [isUserAuthorized], postRegister);
router.get(`/login`, [isUserAuthorized], getLogin);
router.post(`/login`, [isUserAuthorized], postLogin);
router.get(`/logout`, [isUserHasAccess], getLogout);

module.exports = router;
