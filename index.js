'use strict'



var app = require('./app');
var port = 3800;

// crear servidor
app.listen(port, () => {
    console.log('Servidor en linea....');
});