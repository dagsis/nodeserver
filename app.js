'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas

var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var messages_routes = require('./routes/message');


// middewares

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// cors

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// rutas
app.use('/redsocial', user_routes);
app.use('/redsocial/follow', follow_routes);
app.use('/redsocial/publication',publication_routes);
app.use('/redsocial/message',messages_routes);

// export
module.exports = app;