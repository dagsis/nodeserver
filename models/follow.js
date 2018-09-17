'use strict'

var sql = require('mssql');
var settings = require('../setting');

var config = settings.dbConfig;

exports.follow = {
    followedId: null,
    userId: null,
    followed: null
};

module.exports.addFollow = function(follow, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        // query to the database and get the records
        request.input('userId', sql.Int, follow.userId);
        request.input('followed', sql.Int, follow.followId);
       
        request.query('INSERT INTO Follows (userId,followed) VALUES (@userId,@followed)',
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

module.exports.delFollow = function(userId,followId, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        // query to the database and get the records
        request.input('userId', sql.Int, userId);
        request.input('followId', sql.Int, followId);
        
        console.log(userId,followId);
       
        request.query('DELETE FROM Follows WHERE userId=@userId AND followed=@followId',
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




