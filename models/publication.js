'use strict'

var sql = require('mssql');
var settings = require('../setting');

var config = settings.dbConfig;

exports.publication = {
    publicationId: null,
    userId: null,
    text: null,
    file: null,
    created_at: null
};

module.exports.save = function(publication, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        // query to the database and get the records
        request.input('userId', sql.Int, publication.userId);
        request.input('text', sql.VarChar, publication.text);
        request.input('file', sql.VarChar, publication.file);
        request.input('create_at', sql.VarChar, publication.created_at);

       
        request.query('INSERT INTO Publications (userId,text,file_at,created_at) VALUES (@userId,@text,@file,@create_at)',
            function(err, recordset) {

                sql.close();

                if (err) {
                    return done(err, null);
                }

                return done(null, recordset);

            });
    }).catch((err) => {
        return done(err, null);
    });
}

