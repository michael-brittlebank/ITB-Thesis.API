const //packages
    crypto = require('crypto');

var authenticationService = {};

authenticationService.authenticate = function(userSalt, plainTextPassword, hashedPassword) {
    return authenticationService.encryptPassword(userSalt, plainTextPassword) === hashedPassword;
};

authenticationService.createSalt = function() {
    return crypto.randomBytes(16).toString('base64');
};

authenticationService.encryptPassword = function(salt, password) {
    if (!password){
        throw new Error('authenticationService.encryptPassword() No password specified!');
    } else if (!salt){
        throw new Error('authenticationService.encryptPassword() No salt specified!');
    } else {
        const saltBuffer = new Buffer(salt, 'base64');
        return crypto.pbkdf2Sync(password, saltBuffer, 10000, 64, 'SHA1').toString('base64');
    }
};

authenticationService.createToken = function() {
    return crypto.createHash('sha256').update(this.createSalt()).digest('hex');
};

module.exports = authenticationService;