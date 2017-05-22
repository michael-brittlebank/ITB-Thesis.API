const // packages
    express = require('express'),
    router = express.Router(),
//controllers
    adminController = require('../controllers/admin');

router.route('/users/:page/:limit')
    .get(adminController.getUsers);

router.route('/user/:id')
    .delete(adminController.deleteUser);

module.exports = router;
