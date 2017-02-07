const //packages
    mailgun = require('mailgun-js')({apiKey: process.env.EMAIL_API_KEY, domain: process.env.EMAIL_DOMAIN}),
    //services
    logService = require('../services/logs'),
    //controllers
    authenticationController = require('../controllers/authentication');

var authenticationMiddleware = {};

authenticationMiddleware.authenticateBearer = authenticationController.authenticate('bearer', {session:false});

authenticationMiddleware.authenticateLogin = authenticationController.authenticate('local',{failureFlag:true,session: false});

authenticationMiddleware.validateEmailWebhook = function(req,res,next){
    const body = req.body;
    if (!mailgun.validateWebhook(body.timestamp, body.token, body.signature)) {
        logService.error('Request came, but not from Mailgun');
        res.send({ error: { message: 'Invalid signature. Are you even Mailgun?' } });
    } else {
        next();
    }
};

module.exports = authenticationMiddleware;