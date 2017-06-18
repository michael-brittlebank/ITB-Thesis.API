const // packages
    express = require('express'),
    router = express.Router(),
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    userController = require('../controllers/user');

router.route('/')
    .get(authenticationMiddleware.authenticateBearer,
        userController.getCurrentUser)
    .post(authenticationMiddleware.authenticateBearer,
        userController.updateCurrentUser);

router.route('/login')
    .post(authenticationMiddleware.authenticateLogin,
        userController.submitLogin);

router.route('/register')
    .put(userController.submitRegister);

router.route('/forgot-password')
    .post(userController.requestResetPasswordToken);

router.route('/reset-password')
    .post(userController.submitPasswordReset);

module.exports = router;
