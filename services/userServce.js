// sql Server
'use strict'

module.exports.existeUsuario = function() {
    var dat = 0;
    var resul = '';
    return {
        rate: function(value) {
            dat = value;
        },
        get: GetUserExit('marita01', 'marita@gmail.com.ww', function(recordset) {
            return recordset.recordset;
        })
    }
}


function GetUserExit(email, nick, callback) {
    var sql = require('mssql');

    var config = {
        user: 'sa',
        password: 'Zulu1234.',
        database: 'RedSocial',
        server: 'sd-1117476-w.ferozo.com'
    };

    var connection = new sql.connect(config, function(err) {

        // check for error by ...
        var request = new sql.Request(connection);
        request.input('nick', sql.VarChar, nick);
        request.input('email', sql.VarChar, email);
        request.query('select * from users WHERE email=@email or nick=@nick', function(err, recordset) {

            if (err) {
                sql.close();
                res = 'sali';
            }

            // send records as a response
            if (recordset.rowsAffected != 0) {
                callback(recordset);
                sql.close();
            } else {
                callback(recordset);
                sql.close();
            }

        });
    });
}