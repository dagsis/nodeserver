'use strict'

var user = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

var userService = require('../services/userServce');


function home(req, res) {
    res.status(200).send({
        message: 'Winter 2018.- Carlos DAgostino.'
    });
}

function saveUser(req, res) {
    var params = req.body;
    // var user = new User();

    if (params.name && params.surname && params.nick && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
        });


        var mod = userService.existeUsuario(user.nick, user.email, function(err, resultado) {

            if (err) {

                return res.status(200).send({
                    message: err.originalError.message
                });
            }

            if (resultado != 0) {
                return res.status(200).send({
                    mensage: 'El Usuario ya esta registrado en la base de datos'
                });
            } else {

                userService.addUsuario(user, function(err, resultado) {

                    if (resultado) {
                        res.status(200).send({
                            message: 'Registro Agregado Correctamente'
                        });
                    } else {
                        res.status(200).send({
                            message: err.originalError.message
                        });
                    }
                })
            }
        });
    }
}

module.exports = {
    home,
    saveUser
};