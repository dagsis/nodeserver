'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'hola10';

exports.ensureAuth = function(req, res, next){
    console.log('cabe ' + req.headers.authorization)
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Falta Cabecera de Autenticación'});
    }

    var token = req.headers.authorization.replace(/['"]/g, '');

    try {
        var payload = jwt.decode(token,secret);
        if(payload.exp <= moment.unix()) {
            return res.status(401).send({message: 'El token ha expirado'});
        }
    } catch (error) {
        return res.status(404).send({message: 'El token no es válido'});
    }
   
    req.user = payload;

    next();

}

