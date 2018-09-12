'use strict'



var app = require('./app');
var port = 3800;

// crear servidor
app.listen(port, () => {
    console.log('Servidor en linea....');
});



/* sql.connect(config, function (err) {
    
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
       
    // query to the database and get the records
    request.query('select * from Student', function (err, recordset) {
        
        if (err) console.log(err)

        // send records as a response
        res.send(recordset);
        
    });
}); */