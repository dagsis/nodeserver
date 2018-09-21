'user strict'

var moment = require('moment');

var Message = require('../models/message');


function saveMessage(req, res){
    var params = req.body;

    if(!params.text || !params.receiver){
        return res.status(200).send({message: 'Todos los campos son obligatorios'});  
    }

    var message = Message.message;

    message.emmitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = null

    Message.saveMessage(message, function(err, resultado) {
        console.log(err);
        if (err) return res.status(500).send({ message: 'Error al Enviar el Mensaje' });

        if (!resultado) return res.status(404).send({ message: 'El Mensaje no se ha Enviado' });

        return res.status(200).send({ message: 'Mensage Enviado' });

    });
}

module.exports = {
    saveMessage
}
