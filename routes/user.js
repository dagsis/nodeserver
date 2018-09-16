'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var md_auth = require('../middlewares/autenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './assets/images/users'});

var api = express.Router();

api.get('/home',md_auth.ensureAuth ,UserController.home);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id',md_auth.ensureAuth ,UserController.getUser);
api.get('/users/:page?',md_auth.ensureAuth ,UserController.getUsers);
api.put('/user/:id', md_auth.ensureAuth ,UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload] ,UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;