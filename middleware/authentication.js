const //packages
    mailgun = require('mailgun-js')({apiKey: process.env.EMAIL_API_KEY, domain: process.env.EMAIL_DOMAIN}),
    //services
    logService = require('../services/log'),
    errorService = require('../services/error'),
    //controllers
    passportService = require('../services/passport'),
    //models
    userModel = require('../models/user');

let authenticationMiddleware = {};

authenticationMiddleware.authenticateBearer = passportService.authenticate('bearer', {session:false});

authenticationMiddleware.authenticateLogin = passportService.authenticate('local',{failureFlag:true,session: false});

authenticationMiddleware.validateEmailWebhook = function(req,res,next){
    const body = req.body;
    if (!mailgun.validateWebhook(body.timestamp, body.token, body.signature)) {
        logService.error('Request came, but not from Mailgun');
        res.send({ error: { message: 'Invalid signature. Are you even Mailgun?' } });
    } else {
        next();
    }
};

authenticationMiddleware.isAdmin = function(req,res,next){
    if (userModel.isUserAdmin(req.body.user)){
        next();
    } else {
        next(errorService.UnauthorizedError('authenticationMiddleware.isAdmin() User role incorrect'));
    }
};

module.exports = authenticationMiddleware;