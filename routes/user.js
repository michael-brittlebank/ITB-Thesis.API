const // packages
    express = require('express'),
    router = express.Router(),
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    userController = require('../controllers/user');

router.route('/login')
    .post(authenticationMiddleware.authenticateLogin,
        userController.submitLogin);

router.route('/forgot-password')
    .post(userController.requestResetPasswordToken);

router.route('/reset-password')
    .post(userController.submitPasswordReset);

router.route('/me')
    .get(authenticationMiddleware.authenticateBearer,
        userController.getCurrentUser);

// todo
// router.route('/me/workouts')
//     .get(authenticationMiddleware.authenticateBearer,)
//     .put(authenticationMiddleware.authenticateBearer,)
//     .post(authenticationMiddleware.authenticateBearer,);

module.exports = router;
