const //services
    utilService = require('../services/util');

let adminController = {};

adminController.getUsers = function(req, res, next) {
    //todo
    res.status(utilService.status.ok).json('get users');
};

adminController.deleteUser = function(req, res, next) {
    //todo
    res.status(utilService.status.ok).json('delete user');
};

module.exports = adminController;