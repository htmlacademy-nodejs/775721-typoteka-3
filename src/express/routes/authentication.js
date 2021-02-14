'use strict';

const {Router} = require(`express`);

const {getRegister, postRegister, getLogin, postLogin, getLogout} = require(`../controllers/authentication`);
const {isAuthorizedUser} = require(`../middlewares/is-authorized-user`);
const {redirectAuthorizedUsersToHomePage} = require(`../middlewares/redirect-authorized-users-to-home-page`);
const {saveImage} = require(`../middlewares/save-image`);

const router = new Router();
const saveAvatarMiddleware = saveImage(`avatar`);

router.get(`/register`, [redirectAuthorizedUsersToHomePage], getRegister);
router.post(`/register`, [redirectAuthorizedUsersToHomePage, saveAvatarMiddleware], postRegister);
router.get(`/login`, [redirectAuthorizedUsersToHomePage], getLogin);
router.post(`/login`, [redirectAuthorizedUsersToHomePage], postLogin);
router.get(`/logout`, [isAuthorizedUser], getLogout);

module.exports = router;
