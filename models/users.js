const //packages
    promise = require('bluebird'),
//services
    mysqlService = require('../services/mysql'),
    authenticationService = require('../services/authentication');

var usersModel = {};

function getUserObject(result){
    return {
        id: result.id,
        role: result.role,
        firstName: result.first_name,
        lastName: result.last_name,
        email: result.email,
        dateCreated: result.date_created,
        lastLogin: result.last_login,
        salt: result.salt,
        hashedPassword: result.hashed_password,
        token: result.token
    }
}

usersModel.findByEmail = function(email, fullObject){
    if (!email || email.length < 1) {
        return promise.reject(new Error('usersModel.findByEmail() No email specified!'));
    } else {
        return mysqlService
            .select('users.*', 'user_roles.name AS role')
            .from('users')
            .join('user_roles','users.role_id', '=', 'user_roles.id')
            .where({
                email: email
            })
            .limit(1)
            .then(function (result){
                result = result[0];
                if (result) {
                    var user = getUserObject(result);
                    if (!fullObject) {
                        delete user['id'];
                        delete user['salt'];
                        delete user['hashedPassword'];
                        delete user['token'];
                    }
                    return user;
                } else {
                    return result;
                }
            });
    }
};

module.exports = usersModel;