var express = require('express');

var PublicationController = require('../controllers/publication');
var md_auth = require('../middlewares/autenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './assets/images/publication'});

api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);

module.exports = api;