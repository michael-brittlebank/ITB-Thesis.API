const // packages
    express = require('express'),
    router = express.Router(),
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    usersController = require('../controllers/users');

/* GET home page. */
router.route('/login')
    .post(authenticationMiddleware.authenticateLogin,
        usersController.submitLogin);

router.route('/me')
    .get(authenticationMiddleware.authenticateBearer,
        usersController.getCurrentUser);

module.exports = router;
