'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

var herlper = require('../helpers/helper');

function savePublication(req, res) {
    var params = req.body;

    if (!params.text) return res.status(200).send('Debes Enviar un Texto');

    var publication = Publication.publication;
    publication.text = params.text;
    publication.file = null;
    publication.userId = req.user.sub;
    publication.created_at = moment().unix();

    Publication.save(publication, function(err, resultado) {
        console.log(err);

        if (err) return res.status(500).send({ message: 'Error al Guardar la publicación' });

        if (!resultado) return res.status(404).send({ message: 'La Publicación no se ha Guardado' });

        return res.status(200).send({ message: 'Publicación Agregada con Exito' });

    });

}

function getPublications(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 4;
    var sql = `SELECT Follows.followed, Users.name, Users.surname, Users.nick, Users.email, Users.role, 
             Users.image, Publications.text, Publications.file_at, Publications.created_at             
            FROM   Publications INNER JOIN
            Users ON Publications.userId = Users.userId RIGHT OUTER JOIN
            Follows ON Users.userId = Follows.followed
            WHERE   Follows.userId = ` + req.user.sub + `
            ORDER BY Publications.created_at DESC`

    herlper.executeSql(sql).then((resultado, rej) => {
        if (rej) return res.status(500).send({ message: 'Error en el Servidor' });

        if (!resultado) return res.status(404).send({ message: 'No hay Publicaciones' });

        var follows_clean = [];
        resultado.recordset.forEach(follow => {
            follows_clean.push(follow)
        });

        return res.status(200).send({
            user: req.user.sub,
            publications: follows_clean
        })
    });
}

function getPublication(req, res) {
    var publicationId = req.params.id;

    var sql = "SELECT * FROM Publications WHERE PublicationId=" + publicationId
    
    herlper.executeSql(sql).then((resultado, rej) => {
        if (rej) return res.status(500).send({ message: 'Error en el Servidor' });

        if (resultado.rowsAffected == 0) return res.status(404).send({ message: 'No Existe la Publicación' });

        return res.status(200).send({
          publication: resultado.recordset[0]
        })
    });
}

function deletePublication(req, res) {
    var publicationId = req.params.id;

    var sql = `DELETE FROM Publications WHERE PublicationId=` + publicationId + `
               AND userId=` + req.user.sub
    
    herlper.executeSql(sql).then((resultado, rej) => {
        if (rej) return res.status(500).send({ message: 'Error en el Servidor' });

        if (resultado.rowsAffected == 0) return res.status(404).send({ message: 'No Existe la Publicación' });

        return res.status(200).send({
          message: 'Publicación Eliminada'
        })
    });
}

function uploadImage(req, res) {
    var publicationId = req.params.id;

    if (userId != req.user.sub) {
        return removeFileOfuploads(res, file_name, 'No tiene permisos para realizar esta operacion');
    }

    if (req.files) {
        var file_path = req.files.image.path;

        var file_split = file_path.split('\\');

        var file_name = file_split[3];

        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            herlper.executeSql(sql).then((resultado)=>{

               var sql = "SELECT * FROM publications WHERE publicationId=" + publicationId + " AND userId=" +req.user.sub

               if (resultado.rowsAffected != 0){
                   Publication.publicationByIdUpdateImg(publicationId ,file_name, req.user.image, function(err, resultado) {

                    resultado.recordset[0].password = undefined;
                    return res.status(200).send(resultado.recordset[0]);
                    });
               }else {
                    return removeFileOfuploads(res, file_name, 'No tiene permiso para realizar esta operación');
               } 
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
    var path_file = './assets/images/publications/' + image_file;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            return res.status(200).send({ message: 'No existe la Imagen' });
        }
    });
}

module.exports = {
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}