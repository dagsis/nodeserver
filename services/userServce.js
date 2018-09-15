// sql Server
'use strict'
var sql = require('mssql');

var config = {
    user: 'sa',
    password: 'Zulu1234.',
    database: 'RedSocial',
    server: 'sd-1117476-w.ferozo.com'
};

/* module.exports.existeUsuario = function(nick,email) {
           return new Promise(function(resolve,reject) 
          {
            GetUserExit(nick, email, function(recordset) { 
                var resul = false;               
                if (recordset.rowsAffected !=0)
                {
                    resul = true;                   
                }
                return resolve(resul);               
              }) 
          });     
        } */
            
/* module.exports.existeUsuario = function(nick,email,done) {
    GetUserExit(nick, email, function(recordset) { 
        var resul = false;               
        if (recordset.rowsAffected !=0)
        {
            resul = true;                   
        }
        return done(null,resul);               
    });      
} */

module.exports.existeUsuario = function(nick,email,done) {
    var connection = new sql.connect(config, function(err) {

        // check for error by ...
        var request = new sql.Request(connection);

        request.input('nick', sql.VarChar, nick);
        request.input('email', sql.VarChar, email);
        request.query('select * from users WHERE email=@email or nick=@nick', 
                        function(err, recordset) {
                                
                                sql.close();           
                                var resul = false;               
                                if (recordset.rowsAffected !=0)
                                {
                                    resul = true;                   
                                }
                                return done(null,resul);       
                        });
    });
}

function GetUserExit(nick,email, callback) {
 
    var connection = new sql.connect(config, function(err) {

        // check for error by ...
        var request = new sql.Request(connection);

        request.input('nick', sql.VarChar, nick);
        request.input('email', sql.VarChar, email);
        request.query('select * from users WHERE email=@email or nick=@nick', 
                        function(err, recordset) {
                                
                                sql.close();           
                                callback(recordset);           
                        });
    });
}