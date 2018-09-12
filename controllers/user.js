'use strict'

var user = require('../models/user');
var bcrypt = require('bcrypt-nodejs');


// sql Server
var sql = require("mssql");

sql.Promise = global.Promise;

var config = {
    user: 'sa',
    password: 'hola10',
    server: 'NT-DAGSIS',
    database: 'RedSocial'
};

// fin sql server

function home(req, res) {
    res.status(200).send({
        message: 'Hola Mundo del Servidor Nodejs'
    });
}

function pruebas(req, res) {
    res.status(200).send({
        message: 'Accion de Pruebas NodeJs'
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

        // sql mysql mongodb
        // create Request object
        // conexion a la base de dato
        sql.connect(config).then(() => {
            console.log("Conexion Exitosa...");

            var request = new sql.Request();

            request.input('nick', sql.VarChar, user.nick);
            request.input('email', sql.VarChar, user.email);
            request.query('select * from users WHERE email=@email or nick=@nick', function(err, recordset) {

                if (err) {
                    return res.status(200).send({
                        message: err.originalError.info.message
                    });
                }

                // send records as a response
                if (recordset.rowsAffected != 0) {
                    sql.close();
                    return res.status(200).send({
                        mensage: 'Registro Repetido'
                    });
                } else {
                    // query to the database and get the records
                    request.input('name', sql.VarChar, user.name);
                    request.input('surname', sql.VarChar, user.surname);
                    request.input('nick', sql.VarChar, user.nick);
                    request.input('email', sql.VarChar, user.email);
                    request.input('password', sql.VarChar, user.password);
                    request.input('role', sql.VarChar, user.role);
                    request.input('image', sql.VarChar, user.image);

                    request.query('INSERT INTO Users (name,surname,nick,email,password,role,image) VALUES (@name,@surname,@nick,@email,@password,@role,@image)',
                        function(err, recordset) {

                            sql.close();

                            if (err) {
                                res.status(200).send({
                                    message: err.originalError.info.message
                                });
                            }

                            // send records as a response
                            res.status(200).send({
                                message: 'Registro Agregado Correctamente'
                            });
                        });
                }
            });
        }).catch(err => {
            sql.close();

            res.status(200).send({
                message: err
            });
        });

    } else {
        res.status(200).send({
            message: 'Todos los Campos son obligatorios'
        });
    }
}

module.exports = {
    home,
    pruebas,
    saveUser
};