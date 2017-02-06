const //packages
    jwt = require('jsonwebtoken'),
//services
    utilService = require('../services/util'),
    mysqlService = require('../services/mysql'),
    emailService = require('../services/email'),
//models
    usersModel = require('../models/users');

var user = {};

function createToken(user) {
    const payloadObject = {
        email: user.email,
        id: user.id
    };
    return jwt.sign(payloadObject, process.env.SESSION_SECRET, { expiresIn: process.env.SESSION_EXPIRY });
}

user.submitLogin = function(req, res, next) {
    var user = req.user;
    usersModel.reduceUserObject(user);
    user.sessionToken = createToken(req.user);
    emailService.sendMail({
        to: req.user.email,
        subject: 'Hello',
        text: 'Testing some Mailgun awesomness!'
    })
        .then(function(){
            res.status(utilService.status.ok).json(user);
        });
};

user.getCurrentUser = function(req,res,next){
    usersModel.findByEmail(req.user.email)
        .then(function(user){
            res.status(utilService.status.ok).json(user);
        });
};

module.exports = user;