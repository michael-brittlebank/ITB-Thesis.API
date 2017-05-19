const // packages
    express = require('express'),
    router = express.Router(),
//controllers
    adminController = require('../controllers/admin');

router.route('/users')
    .get(adminController.getUsers)
    .delete(adminController.deleteUser);

module.exports = router;
