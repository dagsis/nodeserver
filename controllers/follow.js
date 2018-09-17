'use strict'

var path = require('path');
var fs = require('fs');

var xsql = require('../helpers/helper');

var User = require('../models/user');
var Follow = require('../models/follow');

var follow = Follow.follow;

function saveFollow(req, res) {
    var params = req.body;

    follow.userId = req.user.sub;
    follow.followId = params.followed;

    Follow.addFollow(follow, function(err, resultado) {
        if (err) return res.status(500).send({ message: 'Error al Guardar el seguimiento' });

        if (!resultado) return res.status(404).send({ message: 'El seguimiento no se ha Guardado' });

        return res.status(200).send({ message: 'Followed Eliminado' });

    });
}

function deleteFollow(req, res) {
    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.delFollow(userId, followId, function(err, resultado) {
        if (err) return res.status(500).send({ message: 'Error al Borrar el seguimiento' });

        if (!resultado) return res.status(404).send({ message: 'El seguimiento no se ha Borrado' });

        return res.status(200).send({ follow: resultado.rowsAffected });

    });
}

// Devolver usuarios que sigo
function getMyFollows(req, res) {
    var userId = req.user.sub;

    if (req.params.id) {
        userId = req.params.id;
    }

    var sql = `SELECT  Follows.followedId, Users.userId, Users.name, Users.surname, 
                       Users.nick, Users.email,Users.image
               FROM    Follows LEFT OUTER JOIN
                       Users ON Follows.followed = Users.userId
               WHERE   Follows.userId=` + userId;


    xsql.executeSql(sql, function(err, resultado) {
        if (err) return res.status(500).send({ message: 'Error en el Servidor' });

        if (!resultado) return res.status(404).send({ message: 'No estas siguiendo ningun usuario' });

        return res.status(200).send({
            user: userId,
            following: resultado.recordset
        });
    });
}

// Devolver usuarios que me siguen
function getFollowBacks(req, res) {
    var userId = req.user.sub;

    if (req.params.id) {
        userId = req.params.id;
    }

    var sql = `SELECT  Follows.UserId, Users.name, Users.surname, 
               Users.nick, Users.email, Users.role, Users.image
               FROM    Follows LEFT OUTER JOIN
               Users ON Follows.userId = Users.userId
               WHERE   Follows.followed=` + userId;

    xsql.executeSql(sql, function(err, resultado) {
        if (err) return res.status(500).send({ message: 'Error en el Servidor' });

        if (!resultado) return res.status(404).send({ message: 'No te sigue ningun usuario' });

        return res.status(200).send({
            user: userId,
            followed: resultado.recordset
        });
    });
}

module.exports = {
    saveFollow,
    deleteFollow,
    getMyFollows,
    getFollowBacks
}