const //packages
    promise = require('bluebird'),
//services
    mysqlService = require('../services/mysql'),
    authenticationService = require('../services/authentication');

var userModel = {};

userModel.findByEmail = function(email){
    if (!email || email.length < 1) {
        return promise.reject(new Error('userModel.findByEmail() No email specified!'));
    } else {
        return mysqlService
            .select('*')
            .from('users')
            .where({
                email: email
            })
            .limit(1)
            .then(function (result) {
                return result[0];
            });
    }
};

module.exports = userModel;