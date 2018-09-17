'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');

var md_auth = require('../middlewares/autenticated');

var api = express.Router();

api.post('/followAdd',md_auth.ensureAuth ,FollowController.saveFollow);
api.delete('/followDel/:id',md_auth.ensureAuth ,FollowController.deleteFollow);
api.get('/following/:id?',md_auth.ensureAuth ,FollowController.getMyFollows);
api.get('/followed/:id?',md_auth.ensureAuth ,FollowController.getYourFollows);

module.exports = api;