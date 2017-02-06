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
        passwordSalt: result.password_salt,
        hashedPassword: result.hashed_password,
        resetToken: result.reset_token
    }
}

function findUser(whereParameters){
    return mysqlService
        .select('users.*', 'user_roles.name AS role')
        .from('users')
        .join('user_roles','users.role_id', '=', 'user_roles.id')
        .where(whereParameters)
        .limit(1)
        .then(function (result){
            result = result[0];
            if (result) {
                return getUserObject(result);
            } else {
                return result;
            }
        });
}

usersModel.reduceUserObject = function(user){
    delete user['id'];
    delete user['passwordSalt'];
    delete user['hashedPassword'];
    delete user['resetToken'];
    return user;
};

usersModel.findByEmail = function(email){
    if (!email || email.length < 1) {
        return promise.reject(new Error('usersModel.findByEmail() No email specified'));
    } else {
        return findUser({email: email});
    }
};

usersModel.findByToken = function(token){
    if (!token || token.length < 1) {
        return promise.reject(new Error('usersModel.findByToken() No token specified'));
    } else {
        return findUser({reset_token: token});
    }
};

usersModel.setResetToken = function(email,token){
    return mysqlService('users')
        .where('email', '=', email)
        .update({
            reset_token: token
        })
        .limit(1);
};

usersModel.setPassword = function(user, password){
    return mysqlService('users')
        .where('email', '=', user.email)
        .update({
            hashed_password: authenticationService.encryptPassword(user.passwordSalt, password),
            reset_token: null
        });
};

module.exports = usersModel;