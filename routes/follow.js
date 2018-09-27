'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');

var md_auth = require('../middlewares/autenticated');

var api = express.Router();

api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', md_auth.ensureAuth, FollowController.deleteFollow);
api.get('/getMyFollows/:id?', md_auth.ensureAuth, FollowController.getMyFollows);
api.get('/getYourFollows/:id?', md_auth.ensureAuth, FollowController.getFollowBacks);

module.exports = api;