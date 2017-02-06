const authenticationController = require('../controllers/authentication');

var authenticationMiddleware = {};

authenticationMiddleware.authenticateBearer = authenticationController.authenticate('bearer', {session:false});

authenticationMiddleware.authenticateLogin = authenticationController.authenticate('local',{failureFlag:true,session: false});

module.exports = authenticationMiddleware;