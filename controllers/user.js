'use strict'

var user = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

var userService = require('../services/userServce');

var jwt = require('../services/jwt');


function home(req, res) {
    res.status(200).send({
        message: 'Winter 2018.- Carlos DAgostino.'
    });
}

function saveUser(req, res) {
    var params = req.body;
    // var user = new User();

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


        var mod = userService.UsuarioExiste(user.nick, user.email, function(err, resultado) {

            if (err) {

                return res.status(200).send({
                    message: err.originalError.message
                });
            }

            if (resultado != 0) {
                return res.status(200).send({
                    mensage: 'El Usuario ya esta registrado en la base de datos'
                });
            } else {

                userService.addUsuario(user, function(err, resultado) {

                    if (resultado) {
                        res.status(200).send({
                            message: 'Registro Agregado Correctamente'
                        });
                    } else {
                        res.status(200).send({
                            message: err.originalError.message
                        });
                    }
                });
            }
        });
    } else {
        res.status(200).send({
            message: 'Todos los Campos son Obligarios'
        });
    }

}

function loginUser(req, res) {
    var params = req.body;

    if (params.email && params.password) {
        var email = params.email;
        var password = params.password;

        userService.UsuarioByEmail(email, function(err, resultado) {

            if (err) {
                return res.status(200).send({
                    message: err.originalError.message
                });
            }

            if (!resultado) {
                res.status(200).send({
                    message: 'Usuario Inexistente'
                });
            } else {
                bcrypt.compare(password, resultado.recordset[0].password, (err, check) => {
                    if (check) {
                        // generar y devolver token
                                               
                        return res.status(200).send({
                           token: jwt.createToken(resultado.recordset[0])
                        });

                    } else {
                        res.status(200).send({
                            message: 'Contraseña Invalida'
                        });
                    }
                })
            }
        });

    } else {
        res.status(200).send({
            message: 'Todos los Campos son Obligarios'
        });
    }
}

function getUser(req, res){
    var userId = req.params.id;

    userService.UsuarioById(userId, function(err, resultado) {
        if (err) {
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

        res.status(200).send({                            
            message: resultado.recordset[0]
        });          
    });
}

function getUsers(req,res){
   // Usuario que esta logueado
   var identity_user_id = req.user.sub;
   
   var page = 1;
   if(req.params.page) {
      page = req.params.page; 
   }

   var itemsPage = 5;
   userService.Usuarios(page,itemsPage, function(err,resultado) {
    if (err) {
        return res.status(500).send({
            message: err.originalError.message
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
   
    res.status(200).send({                            
       user: resultado.recordset,
       total: resultado.rowsAffected,
       page
    });            
   }); 
}

function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;

   
    if (userId != req.user.sub){
        return res.status(500).send({
            message: 'No tienen permiso para actualizar los datos del usuario'
        });
    }
   
    userService.UsuarioByIdUpdate(userId, update, function(err, resultado) {
        if (err) {
            return res.status(500).send({
                message: err.originalError.message
            });
        }
    
        if (!resultado) {
            return res.status(404).send({
                message: 'No se actualizo el Usuario'
            });
        } 
    
        res.status(200).send({                            
           user: resultado          
        });            
    }); 
}

function uploadImage(req,res){
    var userId = req.params.id;
 
    if (userId != req.user.sub){
       return removeFileOfuploads(res,file_name, 'No tiene permisos para realizar esta operacion');                        
    }

    if (req.files){
        var file_path = req.files.image.path;               

        var file_split = file_path.split('\\');

        var file_name = file_split[3];
  
        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' ){
             userService.UsuarioByIdUpdateImg(userId,file_name, req.user.image ,function(err, resultado){

                resultado.recordset[0].password = undefined;                
                return res.status(200).send(resultado.recordset[0]);
             });
        }else {
           return removeFileOfuploads(res,file_name, 'Imagen Incorrecta');
        }

    }else {
        return res.status(200).send({
            message: 'No se han subido imagenes'
        });
    }
}

function removeFileOfuploads(res,file_path, message) {
    fs.unlink(file_path, (err)=> {              
        return res.status(200).send({message: message});                             
    });                    
}

function getImageFile(req,res){
    var image_file = req.params.imageFile;
    var path_file = './assets/images/users/' + image_file;

    fs.exists(path_file, function(exists){
       if(exists){
           res.sendFile(path.resolve(path_file));
       } else {
        return res.status(200).send({message: 'No existe la Imagen'});  
       }
    });
}

module.exports = {
    home,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
};