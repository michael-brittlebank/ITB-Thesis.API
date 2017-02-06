const //packages
    jwt = require('jsonwebtoken'),
    promise = require('bluebird'),
//services
    utilService = require('../services/util'),
    mysqlService = require('../services/mysql'),
    emailService = require('../services/email'),
    logService = require('../services/logs'),
    authenticationService = require('../services/authentication'),
    errorService = require('../services/errors'),
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
            if (!user){
                return promise.reject(new errorService.NotFoundError('Could not retrieve user'));
            } else {
                user = usersModel.reduceUserObject(user);
                res.status(utilService.status.ok).json(user);
            }
        })
        .catch(function(error){
            next(error);
        });
};

usersController.requestResetPasswordToken = function(req,res,next){
    req.checkBody('email', 'Email is invalid').isEmail();
    const errors = req.validationErrors();
    if(errors){
        next(errors);
    } else {
        const userEmail = req.body.email,
            token = authenticationService.createToken(),
            data = {
                to: userEmail,
                subject: 'Password Reset Request Received',
                text: 'Here is your reset password link: '+process.env.WEB_DOMAIN+'/reset-password/'+token
            };
        emailService.sendMail(data)
            .then(function(){
                return usersModel.setResetToken(userEmail,token);
            })
            .then(function() {
                res.status(utilService.status.ok).send('A password reset link has been sent to your email');
            })
            .catch(function(error){
                next(error);
            });
    }
};

usersController.submitPasswordReset = function(req,res,next){
    req.checkBody('token', 'A token is required').notEmpty();
    req.checkBody('password', 'A password is required').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        next(errors);
    } else {
        const userPassword = req.body.password,
            resetToken = req.body.token;
        usersModel.findByToken(resetToken)
            .then(function(user){
                if (!user){
                    return promise.reject(new errorService.UnauthorizedError('Invalid token'));
                } else {
                    return usersModel.setPassword(user, userPassword);
                }
            })
            .then(function(){
                res.status(utilService.status.ok).send('Password updated successfully');
            })
            .catch(function(error){
                next(error);
            });
    }
};

module.exports = usersController;