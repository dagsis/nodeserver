'use strict'

var sql = require('mssql');
var settings = require('../setting');

var config = settings.dbConfig;

exports.message = {
    messageId: null,
    emmitter: null,
    receiver: null,
    text: null,
    created_at: null,
    viewed: null
};

module.exports.saveMessage = function(message, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        // query to the database and get the records
        request.input('emitter', sql.Int, message.emmitter);
        request.input('receiver', sql.Int, message.receiver);
        request.input('text', sql.VarChar, message.text);
        request.input('created_at', sql.VarChar, message.created_at);
        request.input('viewed', sql.VarChar, message.viewed)

        request.query(`INSERT INTO Messages (emitter,receiver,text,created_at,viewed) 
                       VALUES (@emitter,@receiver,@text,@created_at,@viewed)`,
            function(err, recordset) {
                if (err) {
                    sql.close();
                    return done(err, null);
                }


                request.query(`SELECT TOP 1 * FROM Messages WHERE emitter=` + message.emmitter + `
                              ORDER BY messageId DESC`,

                    function(err, recordset) {
                      
                        sql.close();
                        return done(null, recordset);
                    });
            });
    }).catch((err) => {
        sql.close();
        return done(err, null);
    });
}