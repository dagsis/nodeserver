'use strict'

var userService = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

var xsql = require('../helpers/helper');

var jwt = require('../services/jwt');



// Creo el Modelo
var user = userService.user;

function home(req, res) {
    res.status(200).send({
        message: 'Winter 2018.- Carlos DAgostino.'
    });
}

function saveUser(req, res) {
    var params = req.body;

    if (params.name && params.surname && params.nick && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
        });

        var sql = "select * from users WHERE email='" + user.email + "' or nick='" + user.nick + "'";

        xsql.executeSql(sql).then((resultado, rej) => {
            if (rej) {

                return res.status(200).send({
                    status: 'error',
                    message: err.originalError.message
                });
            };

            if (resultado.rowsAffected != 0) {
                return res.status(200).send({
                    status: 'error',
                    message: 'El Usuario ya esta registrado en la base de datos'
                });
            } else {

                userService.addUsuario(user, function(err, resultado) {

                    if (resultado) {
                        res.status(200).send({
                            status: 'success',
                            message: 'Registro Agregado Correctamente'
                        });
                    } else {
                        res.status(200).send({
                            status: 'error',
                            message: err.originalError.message
                        });
                    }
                });
            }
        });
    } else {
        res.status(200).send({
            status: 'error',
            message: 'Todos los Campos son Obligarios'
        });
    }

}

function loginUser(req, res) {
    var params = req.body;

    if (params.email && params.password) {
        var email = params.email;
        var password = params.password;

        var sql = "select * from users WHERE email='" + email + "'";
        xsql.executeSql(sql).then((resultado, rej) => {

            if (rej) {
                return res.status(200).send({
                    status: 'error',
                    message: err.originalError.message
                });
            }

            if (resultado.rowsAffected == 0) {
                res.status(200).send({
                    status: 'error',
                    message: 'Usuario Inexistente'
                });
            } else {
                bcrypt.compare(password, resultado.recordset[0].password, (err, check) => {
                    if (check) {

                        resultado.recordset[0].password = undefined;

                        return res.status(200).send({
                            status: 'success',
                            token: jwt.createToken(resultado.recordset[0]),
                            user: resultado.recordset[0]
                        });

                    } else {
                        res.status(200).send({
                            status: 'error',
                            message: 'Contraseña Invalida'
                        });
                    }
                })
            }
        });

    } else {
        res.status(200).send({
            status: 'error',
            message: 'Todos los Campos son Obligarios'
        });
    }
}


function getUser(req, res) {
    var userId = req.params.id;

    var sql = "select * from users WHERE userId=" + req.user.sub;
    xsql.executeSql(sql).then((resultado, rej) => {
        if (rej) {
            return res.status(500).send({
                message: err.originalError.message
            });
        }

        if (!resultado) {
            return res.status(404).send({
                message: 'El Usuario no existe'
            });
        }

        resultado.recordset[0].password = undefined;

        followThisUser(userId, req.user.sub).then((value) => {
            return res.status(200).send({
                user: resultado.recordset[0],
                following: value.followind,
                followeb: value.followeb
            });
        });
    });

}



async function followThisUser(identity_user_id, user_id) {

    var sql = `SELECT  Follows.UserId, Users.name, Users.surname, 
        Users.nick, Users.email, Users.role, Users.image
        FROM    Follows LEFT OUTER JOIN
        Users ON Follows.userId = Users.userId
        WHERE   Follows.followed=` + identity_user_id;

    var followeb = await xsql.executeSql(sql).then((res, rej) => {
        if (rej) return handleError(rej);
        return res.recordset
    });

    var sql = `SELECT  Follows.followedId, Users.userId, Users.name, Users.surname, 
         Users.nick, Users.email,Users.image
         FROM    Follows LEFT OUTER JOIN
         Users ON Follows.followed = Users.userId
         WHERE   Follows.userId=` + user_id;

    var followind = await xsql.executeSql(sql).then((res, rej) => {
        if (rej) return handleError(rej);
        return res.recordset
    });



    return {
        //  followind: following,
        followeb: followeb,
        followind: followind
    }

}

function getUsers(req, res) {
    // Usuario que esta logueado
    var identity_user_id = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPage = 5;

    var sql = "select * from users ORDER by userId";
    xsql.executeSql(sql).then((resultado, rej) => {
        if (rej) {
            return res.status(500).send({
                message: rej.originalError.message
            });
        }

        if (!resultado) {
            return res.status(404).send({
                message: 'Tabla sin Usuarios'
            });
        }

        for (let index = 0; index < resultado.rowsAffected; index++) {
            resultado.recordset[index].password = undefined;
        }

        followUserIds(identity_user_id).then((value) => {
            return res.status(200).send({


                users: resultado.recordset,
                users_following: value.following,
                users_follow_me: value.followed
            });
        });
    });
}

async function followUserIds(user_id) {
    var sql = `SELECT  followed
               FROM    Follows 
               WHERE   userId=` + user_id;

    var following = await xsql.executeSql(sql).then((res, rej) => {
        if (rej) return handleError(rej);
        var follows_clean = [];
        res.recordset.forEach((follow) => {
            follows_clean.push(follow.followed)
        })
        return follows_clean;
    });


    var sql = `SELECT userId
        FROM    Follows 
        WHERE   followed=` + user_id;
    var followed = await xsql.executeSql(sql).then((res, rej) => {
        if (rej) return handleError(rej);

        var follows_clean = [];
        res.recordset.forEach((follow) => {
            follows_clean.push(follow.userId)
        })
        return follows_clean;
    });

    return {
        following: following,
        followed: followed
    }
}

function getCounters(req, res) {
    var user_id = req.user.sub;

    if (req.params.id) {
        user_id = req.params.id;
    }
    getCountFollow(user_id).then((value) => {
        return res.status(200).send(value);
    });

}

async function getCountFollow(user_id) {
    var sql = `SELECT  Count(followed) as cantidad
    FROM    Follows 
    WHERE   userId=` + user_id;

    var following = await xsql.executeSql(sql).then((res, rej) => {
        if (rej) return handleError(rej);
        return res.recordset[0].cantidad;
    });

    var sql = `SELECT  Count(followed) as cantidad
    FROM    Follows 
    WHERE   followed=` + user_id;

    var followed = await xsql.executeSql(sql).then((res, rej) => {
        if (rej) return handleError(rej);
        return res.recordset[0].cantidad;
    });

    var sql = `SELECT  Count(publicationId) as cantidad
    FROM    Publications 
    WHERE   userId=` + user_id;

    var publications = await xsql.executeSql(sql).then((res, rej) => {
        if (rej) return handleError(rej);
        return res.recordset[0].cantidad;
    });

    return {
        following: following,
        followed: followed,
        publications: publications
    }
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;


    if (userId != req.user.sub) {
        return res.status(500).send({
            message: 'No tienen permiso para actualizar los datos del usuario'
        });
    }

    userService.UsuarioByIdUpdate(userId, update, function(err, resultado) {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: err.originalError.message
            });
        }

        if (!resultado) {
            return res.status(404).send({
                status: 'error',
                message: 'No se actualizo el Usuario'
            });
        }

        res.status(200).send({
            status: 'success',
            message: 'Usuario Actualizado con Exito',
            user: resultado
        });
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;



    if (userId != req.user.sub) {
        return removeFileOfuploads(res, file_name, 'No tiene permisos para realizar esta operacion');
    }


    if (req.files) {
        var file_path = req.files.image.path;

        var file_split = file_path.split('\\');

        var file_name = file_split[3];

        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];

        if (file_ext.toLowerCase() == 'png' || file_ext.toLowerCase() == 'jpg' || file_ext.toLowerCase() == 'jpeg' || file_ext.toLowerCase() == 'gif') {

            userService.UsuarioByIdUpdateImg(userId, file_name, req.user.image, function(err, resultado) {

                resultado.recordset[0].password = undefined;
                return res.status(200).send(resultado.recordset[0]);
            });
        } else {
            return removeFileOfuploads(res, file_name, 'Imagen Incorrecta');
        }

    } else {
        return res.status(200).send({
            message: 'No se han subido imagenes'
        });
    }
}

function removeFileOfuploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './assets/images/users/' + image_file;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            return res.status(200).send({ message: 'No existe la Imagen' });
        }
    });
}

module.exports = {
    home,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
};