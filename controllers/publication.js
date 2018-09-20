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





module.exports = {
    savePublication,
    getPublications
}