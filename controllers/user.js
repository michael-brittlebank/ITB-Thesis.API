const //packages
    jwt = require('jsonwebtoken'),
    promise = require('bluebird'),
//services
    utilService = require('../services/util'),
    emailService = require('../services/email'),
    authenticationService = require('../services/authentication'),
    errorService = require('../services/error'),
//models
    userModel = require('../models/user');

let userController = {};

function createToken(user) {
    const payloadObject = {
        email: user.email,
        id: user.id
    };
    return jwt.sign(payloadObject, process.env.SESSION_SECRET, { expiresIn: process.env.SESSION_EXPIRY });
}

userController.submitLogin = function(req, res, next) {
    res.status(utilService.status.ok).json({sessionToken: createToken(req.user)});
};

userController.getCurrentUser = function(req,res,next){
    userModel.findByEmail(req.user.email)
        .then(function(user){
            if (!user){
                return promise.reject(new errorService.NotFoundError('Could not retrieve user'));
            } else {
                user = userModel.reduceUserObject(user);
                res.status(utilService.status.ok).json(user);
            }
        })
        .catch(function(error){
            next(error);
        });
};

userController.requestResetPasswordToken = function(req,res,next){
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
                return userModel.setResetToken(userEmail,token);
            })
            .then(function() {
                res.status(utilService.status.ok).send('A password reset link has been sent to your email');
            })
            .catch(function(error){
                next(error);
            });
    }
};

userController.submitPasswordReset = function(req,res,next){
    req.checkBody('token', 'A token is required').notEmpty();
    req.checkBody('password', 'A password is required').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        next(errors);
    } else {
        const userPassword = req.body.password,
            resetToken = req.body.token;
        userModel.findByToken(resetToken)
            .then(function(user){
                if (!user){
                    return promise.reject(new errorService.UnauthorizedError('Invalid token'));
                } else {
                    return userModel.setPassword(user, userPassword);
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

module.exports = userController;