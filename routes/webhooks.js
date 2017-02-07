const // packages
    express = require('express'),
    router = express.Router(),
    //middleware
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    webhooksController = require('../controllers/webhooks');

router.route('/mailgun/*')
    .post(authenticationMiddleware.validateEmailWebhook);

router.route('/mailgun/catchall')
    .post(webhooksController.mailgunCatchAll);

module.exports = router;
