'use strict'

var sql = require('mssql');
var helper = require('../helpers/helper');

var config = helper.configDb;

sql.Promise = global.Promise;

module.exports.existeUsuario = function(nick, email, done) {
    var connection = new sql.connect(config, function(err) {

        if (err) {
            sql.close();
            return done(err, null);
        }

        var request = new sql.Request(connection);

        request.input('nick', sql.VarChar, nick);
        request.input('email', sql.VarChar, email);
        request.query('select * from users WHERE email=@email or nick=@nick',
            function(err, recordset) {

                var resul = false;

                if (err) {
                    sql.close();
                    return done(err, null);
                }

                if (recordset.rowsAffected != 0) {
                    resul = true;
                }

                sql.close();
                return done(null, resul);

            });
    });
}


module.exports.addUsuario = function(user, done) {


    sql.connect(config).then(() => {

        var request = new sql.Request();

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