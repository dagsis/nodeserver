'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'hola10';

exports.createToken = function(user){
   var payload = {
        sub: user.userId,
        name: user.name,
        nick: user.nick,
        surname: user.subname,
        email: user.emai,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30,'day').unix
   };
   
   return jwt.encode(payload, secret);   
};
