'use strict'

var sqlDb = require('mssql');
var settings = require('../setting');

exports.executeSql = function (sql, callback) {
   
   sqlDb.connect(settings.dbConfig).then(function () {
      var req = new sqlDb.Request();

      req.query(sql).then(function(recordset){

           console.log(recordset);
          
           sqlDb.close();             
           callback(null, recordset);
           
      }).catch(function(err){
        console.log('Error query '+ err); 
        sqlDb.close();  
        callback(err);
      });

   }).catch(function(err){
       console.log('Error Conec'+ err);
       callback(err);
   })

}