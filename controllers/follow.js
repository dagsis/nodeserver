'use strict'

var path = require('path');
var fs = require('fs');

var User = require('../models/user');
var Follow = require('../models/follow');

var follow = Follow.follow;

function saveFollow(req, res) {
   var params = req.body;

   follow.userId = req.user.sub;
   follow.followId = params.followed;
   
   Follow.addFollow(follow, function(err, resultado){
       if(err) return res.status(500).send({message: 'Error al Guardar el seguimiento'});

       if (!resultado)  return res.status(404).send({message: 'El seguimiento no se ha Guardado'});

       return res.status(200).send({message: 'Followed Eliminado'});
  
   });
}   

function deleteFollow(req, res) {
   var userId = req.user.sub;
   var followId = req.params.id;

    Follow.delFollow(userId, followId, function(err, resultado){
    if(err) return res.status(500).send({message: 'Error al Borrar el seguimiento'});

    if (!resultado)  return res.status(404).send({message: 'El seguimiento no se ha Borrado'});

    return res.status(200).send({follow: resultado.rowsAffected});

    });
}

module.exports = {
    saveFollow,
    deleteFollow
}
