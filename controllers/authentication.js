const //packages
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
//services
    utilService = require('../services/util'),
    logService = require('../services/logs'),
    authenticationService = require('../services/authentication'),
//models
    userModel = require('../models/users');

passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        req.checkBody('password', 'Password not provided').notEmpty();
        req.checkBody('email', 'Email is invalid').isEmail();
        const errors = req.validationErrors();
        if(errors){
            logService.error('authenticationController.local()');
            return done(errors);
        } else {
            userModel.findByEmail(email)
                .then(function(user){
                    if (!user || !utilService.nullCheck(user,'salt') || !utilService.nullCheck(user,'hashed_password')){
                        logService.error('authenticationController.local() Invalid credentials');
                        return done(null, false, { message: 'passport.local() Invalid credentials' });
                    } else {
                        if (authenticationService.authenticate(user.salt, password, user.hashed_password)){
                            return done(null, user);
                        } else {
                            logService.error('authenticationController.local() Login failed');
                            return done(null, false, { message: 'passport.local() Login failed' });
                        }
                    }
                })
                .catch(function(error){
                    logService.error('authenticationController.local()');
                    return done(error);
                });
        }
    }
));


//todo, is logged in

//todo, is admin

module.exports = passport;