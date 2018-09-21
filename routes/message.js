'use strict'

var express = require('express');
var MessageController = require('../controllers/message');

var md_auth = require('../middlewares/autenticated');

var api = express.Router();

api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);

module.exports = api;


