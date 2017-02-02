const //services
    mysqlService = require('../services/mysql');

var user = {};

user.submitLogin = function(req, res, next) {
    mysqlService.select('*').from('users')
        .then(function(results){
            res.send(results);
        });
};

module.exports = user;