'use strict'

var sql = require('mssql');
var helper = require('../helpers/helper');

var config = helper.configDb;

sql.Promise = global.Promise;

module.exports.UsuarioExiste = function(nick, email, done) {
    var connection = new sql.connect(config, function(err) {

        if (err) {
            sql.close();
            return done(err, null);
        }

        var request = new sql.Request(connection);

        request.input('nick', sql.VarChar, nick);
        request.input('email', sql.VarChar, email);
        request.query('select * from users WHERE email=@email or nick=@nick',
            function(err, recordset) {

                var resul = false;

                if (err) {
                    sql.close();
                    return done(err, null);
                }

                if (recordset.rowsAffected != 0) {
                    resul = true;
                }

                sql.close();
                return done(null, resul);

            });
    });
}

module.exports.UsuarioByEmail = function(email, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        request.input('email', sql.VarChar, email);
        request.query('select * from users WHERE email=@email',
            function(err, recordset) {

                sql.close();

                if (err) {
                    return done(err, null);
                }

                if (recordset.rowsAffected == 0) {
                    return done(null, null);
                }

                return done(null, recordset);

            });
    }).catch((err) => {
        return done(err, null);
    });
}

module.exports.UsuarioById = function(id, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        request.input('id', sql.Int, id);
        request.query('select * from users WHERE userId=@id',
            function(err, recordset) {

                sql.close();

                if (err) {
                    return done(err, null);
                }

                if (recordset.rowsAffected == 0) {
                    return done(null, null);
                }

                return done(null, recordset);

            });
    }).catch((err) => {
        return done(err, null);
    });
}

module.exports.Usuarios = function(page,itemsPage, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        request.input('page', sql.Int, page);
        request.input('itemPage', sql.Int, itemsPage);

        request.query('select * from users Order by userId',
            function(err, recordset) {

                sql.close();

                if (err) {
                    return done(err, null);
                }

                if (recordset.rowsAffected == 0) {
                    return done(null, null);
                }

                return done(null, recordset);

            });
    }).catch((err) => {
        return done(err, null);
    });
}

module.exports.addUsuario = function(user, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        // query to the database and get the records
        request.input('name', sql.VarChar, user.name);
        request.input('surname', sql.VarChar, user.surname);
        request.input('nick', sql.VarChar, user.nick);
        request.input('email', sql.VarChar, user.email);
        request.input('role', sql.VarChar, user.role);

        request.query('INSERT INTO Users (name,surname,nick,email,password,role,image) VALUES (@name,@surname,@nick,@email,@password,@role,@image)',
            function(err, recordset) {

                sql.close();

                var resul = false;

                if (err) {
                    return done(err, resul);
                }

                resul = true;

                return done(null, resul);

            });
    }).catch((err) => {
        return done(err, null);
    });
}

module.exports.UsuarioByIdUpdate = function(userId,user,done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        request.input('id', sql.Int, userId);
        request.query('select * from users WHERE userId=@id',
            function(err, recordset) {
              
                if (err) {
                    return done(err, null);
                }

                if (recordset.rowsAffected == 0) {
                    return done(null, null);
                }

                // query to the database and get the records
                request.input('id', sql.Int, userId);
                request.input('name', sql.VarChar, user.name);
                request.input('surname', sql.VarChar, user.surname);
                request.input('nick', sql.VarChar, user.nick);
                request.input('email', sql.VarChar, user.email);
              
                request.query('UPDATE Users SET name=@name,surname=@surname,nick=@nick,email=@email where userId=@id',
                    function(err, recordset) {

                        console.log( recordset);

                        sql.close();

                        if (err) {
                            return done(err, null);
                        }

                        var updateUser = {
                            id: userId, 
                                name: user.name,
                                surname: user.surname,
                                nick: user.nick,
                                email:user.email                            
                        };

                        return done(null, updateUser)
                    });
            });

    }).catch((err) => {
        return done(err, null);
    });
}

module.exports.UsuarioByIdUpdateImg = function(userId, fileName, fileNameOld, done) {
    sql.connect(config).then(() => {

        var request = new sql.Request();

        request.input('id', sql.Int, userId);
        request.input('image', sql.VarChar, fileName);      
        request.query('UPDATE Users SET image=@image where userId=@id',
            function(err) {
                
                if (err) {
                    return done(err, null);
                }

                request.input('id', sql.Int, userId);
                request.query('select * from users WHERE userId=@id',
                    function(err, recordset) {
                      
                        if (err) {
                            return done(err, null);
                        }
        
                        if (recordset.rowsAffected == 0) {
                            return done(null, null);
                        }
        
                sql.close();

               console.log(fileNameOld);

                if(fileNameOld){
                    var filePath = './assets/images/users/' + fileNameOld;
                    fs.unlink(filePath, (err)=> {              
                        return done(null, recordset);                          
                    });   
                }else {
                    return done(null, recordset)
                }
            });
        });                
    }).catch((err) => {
        return done(err, null);
    });
}


