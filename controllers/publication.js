'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

var herlper = require('../helpers/helper');

function savePublication(req,res){
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

        return res.status(200).send({ message: 'Publicación Agregada con Exito'});

    });

}

function getPublications(req,res){
   
}

module.exports = {
    savePublication
}