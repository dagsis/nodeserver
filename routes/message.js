'use strict'

var express = require('express');
var MessageController = require('../controllers/message');

var md_auth = require('../middlewares/autenticated');

var api = express.Router();

api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-message', md_auth.ensureAuth, MessageController.getReceiveMessages);
api.get('/messages', md_auth.ensureAuth, MessageController.getEmitMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;