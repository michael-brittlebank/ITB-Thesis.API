const // packages
    express = require('express'),
    router = express.Router(),
//controllers
    userController = require('../controllers/user');

/* GET home page. */
router.route('/login')
    .get(userController.submitLogin);

module.exports = router;
