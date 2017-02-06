const // packages
    express = require('express'),
    router = express.Router(),
    authenticationController = require('../controllers/authentication'),
//controllers
    userController = require('../controllers/user');

/* GET home page. */
router.route('/login')
    .post(authenticationController.authenticate('local',{session: false}),
        userController.submitLogin);

module.exports = router;
