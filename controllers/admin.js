const //packages
    _ = require('lodash'),
    //services
    utilService = require('../services/util'),
    logService = require('../services/log'),
    //models
    userModel = require('../models/user');

let adminController = {};

adminController.getUsers = function(req, res, next) {
    req.checkParams('page', 'Page is required').notEmpty();
    req.checkParams('limit', 'Limit required').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        next(errors);
    } else {
        userModel.getUsers(req.params.page, req.params.limit)
            .then(function(users){
                users = _.map(users,userModel.reduceUserObject);
                res.status(utilService.status.ok).json(users);
            })
            .catch(function(error){
                logService.error('userController.submitUpdate()',error);
                return next(error);
            });

    }
};

adminController.deleteUser = function(req, res, next) {
    //todo
    res.status(utilService.status.ok).json('delete user');
};

module.exports = adminController;