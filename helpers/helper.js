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
                     console.log("Error " + err);
                     sqlDb.close();
                     rej(err);
                 });
             }).catch(function(err) {
                 console.log('cath '+ err);
                 sqlDb.close();
                 rej(err);
             });
           
     
         }).catch(function(err){
             console.log('Err1 ' + err);
                      
             sqlDb.close();
            
         });

}



module.exports = {
    executeSql
}