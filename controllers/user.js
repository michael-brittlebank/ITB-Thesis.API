const //packages
    jwt = require('jsonwebtoken'),
//services
    utilService = require('../services/util'),
    mysqlService = require('../services/mysql');

var user = {};

function createToken(user) {
    const payloadObject = {
        email: user.email,
        id: user.id
    };
    return jwt.sign(payloadObject, process.env.SESSION_SECRET, { expiresIn: process.env.SESSION_EXPIRY });
}

user.submitLogin = function(req, res, next) {
    res.status(utilService.status.ok).json({token:createToken(req.user)});

};

module.exports = user;