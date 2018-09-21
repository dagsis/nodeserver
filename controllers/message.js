'user strict'

var herlper = require('../helpers/helper');
var moment = require('moment');

var Message = require('../models/message');


function saveMessage(req, res) {
    var params = req.body;

    if (!params.text || !params.receiver) {
        return res.status(200).send({ message: 'Todos los campos son obligatorios' });
    }

    var message = Message.message;

    message.emmitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false'

    Message.saveMessage(message, function(err, resultado) {
        if (err) return res.status(500).send({ message: 'Error al Enviar el Mensaje' });

        if (!resultado) return res.status(404).send({ message: 'El Mensaje no se ha Enviado' });

        return res.status(200).send({ message: resultado.recordset });

    });
}


function getReceiveMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page
    }

    var itemsPage = 4;

    var sql = `SELECT Messages.messageId, Messages.created_at,Messages.text,Messages.receiver ,Users.userId as emitter, Users.name, Users.surname, Users.nick, Users.image, Messages.viewed
    FROM   Messages LEFT OUTER JOIN
    Users ON Messages.emitter = Users.userId
    WHERE receiver=` + req.user.sub + `
    ORDER BY messageId DESC`


    herlper.executeSql(sql).then((resultado, rej) => {
        if (rej) return res.status(500).send({ message: 'Error en el Servidor' });

        if (!resultado) return res.status(404).send({ message: 'Sin mensajes recibido' });

        return res.status(200).send({
            messages: resultado.recordset
        });
    });

}

function getEmitMessages(req, res) {
    var userId = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page
    }

    var itemsPage = 4;

    var sql = `SELECT Messages.messageId, Messages.created_at,Messages.text,Messages.emitter ,Users.userId as receiver, Users.name, Users.surname, Users.nick, Users.image, Messages.viewed
    FROM   Messages LEFT OUTER JOIN
    Users ON Messages.receiver = Users.userId
    WHERE emitter=` + req.user.sub + `
    ORDER BY messageId DESC`


    herlper.executeSql(sql).then((resultado, rej) => {
        if (rej) return res.status(500).send({ message: 'Error en el Servidor' });

        if (!resultado) return res.status(404).send({ message: 'Sin mensajes recibido' });

        return res.status(200).send({
            messages: resultado.recordset
        });
    });

}

function getUnviewedMessages(req, res) {
    var userId = req.user.sub;

    var sql = `SELECT count(messageId) as cantidad
    FROM   Messages 
    WHERE receiver=` + userId + ` AND viewed = 'false'`

    herlper.executeSql(sql).then((resultado, rej) => {
        if (rej) return res.status(500).send({ message: 'Error en el Servidor' });

        if (!resultado) return res.status(404).send({ message: 'Sin mensajes recibido' });

        return res.status(200).send({
            unviewed: resultado.recordset[0].cantidad
        });
    });
}

function setViewedMessages(req, res) {
    var userId = req.user.sub;
    var sql = `UPDATE  Messages SET viewed='true'
    WHERE receiver=` + userId + ` AND viewed = 'false'`

    herlper.executeSql(sql).then((resultado, rej) => {
        if (rej) return res.status(500).send({ message: 'Error en el Servidor' });

        return res.status(200).send({
            message: 'viewed actualizado'
        });
    });

}

module.exports = {
    saveMessage,
    getReceiveMessages,
    getEmitMessages,
    getUnviewedMessages,
    setViewedMessages
}