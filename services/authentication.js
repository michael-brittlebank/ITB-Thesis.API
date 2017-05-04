const //packages
    crypto = require('crypto');

let authenticationService = {};

authenticationService.authenticate = function(passwordSalt, plainTextPassword, hashedPassword) {
    return authenticationService.encryptPassword(passwordSalt, plainTextPassword) === hashedPassword;
};

authenticationService.createSalt = function() {
    return crypto.randomBytes(16).toString('base64');
};

authenticationService.encryptPassword = function(passwordSalt, password) {
    if (!password){
        throw new Error('authenticationService.encryptPassword() No password specified');
    } else if (!passwordSalt){
        throw new Error('authenticationService.encryptPassword() No password salt specified');
    } else {
        const passwordSaltBuffer = new Buffer(passwordSalt, 'base64');
        return crypto.pbkdf2Sync(password, passwordSaltBuffer, 10000, 64, 'SHA1').toString('base64');
    }
};

authenticationService.createToken = function() {
    return crypto.createHash('sha256').update(this.createSalt()).digest('hex');
};

module.exports = authenticationService;