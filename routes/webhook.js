const // packages
    express = require('express'),
    router = express.Router(),
    //middleware
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    webhookController = require('../controllers/webhook');

router.route('/mailgun/*')
    .post(authenticationMiddleware.validateEmailWebhook);

router.route('/mailgun/catchall')
    .post(webhookController.mailgunCatchAll);

module.exports = router;
