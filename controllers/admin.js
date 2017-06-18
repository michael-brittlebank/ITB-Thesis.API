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
                logService.error('userController.updateCurrentUser()',error);
                return next(error);
            });
    }
};

adminController.deleteUser = function(req, res, next) {
    req.checkParams('id', 'User Id is required').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        next(errors);
    } else {
        userModel.deleteUserById(req.params.id)
            .then(function(){
                res.status(utilService.status.ok).send('ok');
            })
            .catch(function(error){
                logService.error('userController.deleteUser()',error);
                return next(error);
            });

    }
};

module.exports = adminController;