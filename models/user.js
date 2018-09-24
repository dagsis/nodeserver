'use strict'

var sql = require('mssql');
var settings = require('../setting');

var config = settings.dbConfig;
var fs = require('fs');
var path = require('path');

sql.Promise = global.Promise;

exports.user = {
    name: null,
    surname: null,
    nick: null,
    email: null,
    password: null,
    role: null,
    image: null
};

module.exports.addUsuario = function(user, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        // query to the database and get the records
        request.input('name', sql.VarChar, user.name);
        request.input('surname', sql.VarChar, user.surname);
        request.input('nick', sql.VarChar, user.nick);
        request.input('email', sql.VarChar, user.email);
        request.input('role', sql.VarChar, user.role);
        request.input('password', sql.VarChar, user.password);
        request.input('image', sql.VarChar, user.image);

        request.query('INSERT INTO Users (name,surname,nick,email,password,role,image) VALUES (@name,@surname,@nick,@email,@password,@role,@image)',
            function(err, recordset) {

                sql.close();

                var resul = false;

                if (err) {
                    return done(err, resul);
                }

                resul = true;

                return done(null, resul);

            });
    }).catch((err) => {
        return done(err, null);
    });
}

module.exports.UsuarioByIdUpdate = function(userId, user, done) {

    sql.connect(config).then(() => {

        var request = new sql.Request();

        request.input('id', sql.Int, userId);
        request.query('select * from users WHERE userId=@id',
            function(err, recordset) {

                if (err) {
                    return done(err, null);
                }

                if (recordset.rowsAffected == 0) {
                    return done(null, null);
                }

                // query to the database and get the records
                request.input('id', sql.Int, userId);
                request.input('name', sql.VarChar, user.name);
                request.input('surname', sql.VarChar, user.surname);
                request.input('nick', sql.VarChar, user.nick);
                request.input('email', sql.VarChar, user.email);

                request.query('UPDATE Users SET name=@name,surname=@surname,nick=@nick,email=@email where userId=@id',
                    function(err, recordset) {

                        console.log(recordset);

                        sql.close();

                        if (err) {
                            return done(err, null);
                        }

                        var updateUser = {
                            id: userId,
                            name: user.name,
                            surname: user.surname,
                            nick: user.nick,
                            email: user.email
                        };

                        return done(null, updateUser)
                    });
            });

    }).catch((err) => {
        return done(err, null);
    });
}

module.exports.UsuarioByIdUpdateImg = function(userId, fileName, fileNameOld, done) {


    sql.connect(config).then(() => {

        var request = new sql.Request();

        request.input('id', sql.Int, userId);
        request.query('select image from users WHERE userId=@id',
            function(err, recordset) {

                if (err) {
                    return done(err, null);
                }

                fileNameOld = null

                if (recordset.rowsAffected != 0) {
                    fileNameOld = recordset.recordset[0].image
                }

                console.log('Archivo Anterior: ' + fileNameOld);

                request.input('id', sql.Int, userId);
                request.input('image', sql.VarChar, fileName);
                request.query('UPDATE Users SET image=@image where userId=@id',
                    function(err) {

                        if (err) {
                            return done(err, null);
                        }



                        request.input('id', sql.Int, userId);
                        request.query('select * from users WHERE userId=@id',
                            function(err, recordset) {

                                if (err) {
                                    return done(err, null);
                                }

                                if (recordset.rowsAffected == 0) {
                                    return done(null, null);
                                }

                                sql.close();

                                if (fileNameOld) {
                                    var filePath = './assets/images/users/' + fileNameOld;
                                    fs.unlink(filePath, (err) => {
                                        return done(null, recordset);
                                    });
                                } else {
                                    return done(null, recordset)
                                }
                            });
                    });
            });
    }).catch((err) => {
        console.log(err);
        return done(err, null);
    });
}