const //packages
    jwt = require('jsonwebtoken'),
//services
    utilService = require('../services/util'),
    mysqlService = require('../services/mysql'),
    emailService = require('../services/email'),
    logService = require('../services/logs'),
    authenticationService = require('../services/authentication'),
//models
    usersModel = require('../models/users');

var usersController = {};

function createToken(user) {
    const payloadObject = {
        email: user.email,
        id: user.id
    };
    return jwt.sign(payloadObject, process.env.SESSION_SECRET, { expiresIn: process.env.SESSION_EXPIRY });
}

usersController.submitLogin = function(req, res, next) {
    var user = req.user;
    usersModel.reduceUserObject(user);
    user.sessionToken = createToken(req.user);
    res.status(utilService.status.ok).json(user);
};

usersController.getCurrentUser = function(req,res,next){
    usersModel.findByEmail(req.user.email)
        .then(function(user){
            res.status(utilService.status.ok).json(user);
        });
};

usersController.requestResetPasswordToken = function(req,res,next){
    req.checkBody('email', 'Email is invalid').isEmail();
    const errors = req.validationErrors();
    if(errors){
        next(errors);
    } else {
        const userEmail = req.body.email,
            token = authenticationService.createToken();
        emailService.sendMail({
            to: userEmail,
            subject: 'Password Reset Request Received',
            text: 'Here is your reset password link: '+process.env.WEB_DOMAIN+'/reset-password/'+token
        })
            .then(function(){
                return mysqlService('users')
                    .where('email', '=', userEmail)
                    .update({
                        reset_token: token
                    });
            })
            .then(function () {
                res.status(utilService.status.ok).send('A password reset link has been sent to your email');
            });
    }
};

usersController.submitPasswordReset = function(req,res,next){
    //todo
    res.status(utilService.status.ok).send('Password updated successfully');
};

module.exports = usersController;