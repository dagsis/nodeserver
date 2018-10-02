'use strict'

var sql = require('mssql');
var settings = require('../setting');

let executeSql = (sqls) => {

    return new Promise((res, rej) => {


        new sql.ConnectionPool(settings.dbConfig).connect().then(pool => {
            return pool.request().query(sqls)
        }).then(recordset => {
            /*  let rows = result.recordset
             res.setHeader('Access-Control-Allow-Origin', '*')
             res.status(200).json(rows); */
            sql.close();
            res(recordset);

        }).catch(err => {
            rej(err);
            sql.close();
        });
    });

}



module.exports = {
    executeSql
}