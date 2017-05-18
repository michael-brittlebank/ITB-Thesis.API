const //packages
    promise = require('bluebird'),
//services
    mysqlService = require('../services/mysql'),
    authenticationService = require('../services/authentication'),
    utilService = require('../services/util');

let userModel = {};

function mapToSchema(result){
    return {
        id: result.id,
        role: result.role.toUpperCase(),
        firstName: result.first_name,
        lastName: result.last_name,
        email: result.email,
        dateCreated: result.date_created,
        lastModified: result.last_modified,
        passwordSalt: result.password_salt,
        hashedPassword: result.hashed_password,
        resetToken: result.reset_token
    };
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
                return mapToSchema(result);
            } else {
                return result;
            }
        });
}

userModel.reduceUserObject = function(user){
    delete user.id;
    delete user.passwordSalt;
    delete user.hashedPassword;
    delete user.resetToken;
    return user;
};

userModel.findByEmail = function(email){
    if (!email || email.length < 1) {
        return promise.reject(new Error('userModel.findByEmail() No email specified'));
    } else {
        return findUser({email: email});
    }
};

userModel.findByToken = function(token){
    if (!token || token.length < 1) {
        return promise.reject(new Error('userModel.findByToken() No token specified'));
    } else {
        return findUser({reset_token: token});
    }
};

userModel.setResetToken = function(email,token){
    return mysqlService('users')
        .where('email', '=', email)
        .update({
            reset_token: token
        })
        .limit(1);
};

userModel.setPassword = function(user, password){
    return mysqlService('users')
        .where('email', '=', user.email)
        .update({
            hashed_password: authenticationService.encryptPassword(user.passwordSalt, password),
            reset_token: null
        });
};

userModel.doesUserExist = function(user){
    return !!user && utilService.isValueNotNull(user,'passwordSalt') && utilService.isValueNotNull(user,'hashedPassword')
};

userModel.createUser = function(firstName, lastName, email, password){
    let passwordSalt = authenticationService.createSalt(),
        hashedPassword = authenticationService.encryptPassword(passwordSalt,password);
    return mysqlService('users')
        .insert({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password_salt: passwordSalt,
            hashed_password: hashedPassword
        })
        .then(function (result){
            result = result[0];
            if (result) {
                return findUser({email: email});
            } else {
                return promise.reject(new Error('userModel.createUser() Could not create user'));
            }
        });
};

userModel.updateUser = function(user, firstName, lastName, password){
    let updateObject = {
        first_name: firstName,
        last_name: lastName
    };
    if(password.length > 0){
        updateObject.hashed_password = authenticationService.encryptPassword(user.passwordSalt,password)
    }
    return mysqlService('users')
        .update(updateObject)
        .where({
            email: user.email
        })
        .limit(1)
        .then(function (result){
            if (result || result === 0) {
                return result;
            } else {
                return promise.reject(new Error('userModel.updateUser() Could not update user'));
            }
        });
};

module.exports = userModel;