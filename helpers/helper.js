'use strict'

var sqlDb = require('mssql');
var settings = require('../setting');

let executeSql = (sql) => {

    return new Promise((res, rej) => {
        sqlDb.connect(settings.dbConfig).then(function() {
            var req = new sqlDb.Request();

            req.query(sql).then(function(recordset) {
                sqlDb.close();
                res(recordset);

            }).catch(function(err) {
                console.log('Error query ' + err);
                sqlDb.close();
                rej(err);
            });
        }).catch(function(err) {
            sqlDb.close();
            console.log('Error Conec' + err);
            rej(err);
        });

    });

}



module.exports = {
    executeSql
}