const // packages
    express = require('express'),
    router = express.Router(),
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    usersController = require('../controllers/users');

router.route('/login')
    .post(authenticationMiddleware.authenticateLogin,
        usersController.submitLogin);

router.route('/forgot-password')
    .post(usersController.requestResetPasswordToken);

router.route('/reset-password')
    .put(usersController.submitPasswordReset);

router.route('/me')
    .get(authenticationMiddleware.authenticateBearer,
        usersController.getCurrentUser);

// todo
// router.route('/me/workouts')
//     .get(authenticationMiddleware.authenticateBearer,)
//     .put(authenticationMiddleware.authenticateBearer,)
//     .post(authenticationMiddleware.authenticateBearer,);

module.exports = router;
