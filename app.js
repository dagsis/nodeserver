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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
})

// rutas
app.use('/redsocial', user_routes);
app.use('/redsocial/follow', follow_routes);
app.use('/redsocial/publication',publication_routes);
app.use('/redsocial/message',messages_routes);

// export
module.exports = app;