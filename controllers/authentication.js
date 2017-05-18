const //packages
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    bearerStrategy = require('passport-http-bearer').Strategy,
    jwt = require('jsonwebtoken'),
//services
    utilService = require('../services/util'),
    logService = require('../services/log'),
    authenticationService = require('../services/authentication'),
//models
    userModel = require('../models/user');

passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        req.checkBody('password', 'Password not provided').notEmpty();
        req.checkBody('email', 'Email is invalid').notEmpty().isEmail();
        const errors = req.validationErrors();
        if(errors){
            logService.error('authenticationController.local()');
            return done(errors);
        } else {
            userModel.findByEmail(email)
                .then(function(user){
                    if (!userModel.doesUserExist(user)){
                        logService.error('authenticationController.local() Invalid credentials');
                        return done(null, false, { message: 'passport.local() Invalid credentials' });
                    } else {
                        if (authenticationService.authenticate(user.passwordSalt, password, user.hashedPassword)){
                            return done(null, user);
                        } else {
                            logService.error('authenticationController.local() Login failed');
                            return done(null, false, { message: 'passport.local() Login failed' });
                        }
                    }
                })
                .catch(function(error){
                    logService.error('authenticationController.local()',error);
                    return done(null, false, { message: 'passport.local() Login failed' });
                });
        }
    }
));

passport.use(new bearerStrategy(
    function(token, done) {
        try {
            jwt.verify(token, process.env.SESSION_SECRET, function(error, session) {
                if (error) {
                    logService.error(error);
                    return done(null, false);
                } else {
                    userModel.findByEmail(session.email)
                        .then(function(user) {
                            if (!user) {
                                return done(null, false);
                            } else {
                                return done(null, user);
                            }
                        });
                }
            });
        } catch (err) {
            return done(null, false);
        }
    }
));

module.exports = passport;