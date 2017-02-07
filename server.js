const //packages
    express = require('express'),
    cors = require('cors'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    path = require('path'),
    compression = require('compression'),
    expressValidator = require('express-validator'),
    contentLength = require('express-content-length-validator'),
    redirect = require('express-redirect'),
    moment = require('moment'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
//services
    logService = require('./services/logs'),
    errorService = require('./services/errors'),
    utilService = require('./services/util'),
// routes
    usersRoutes = require('./routes/users'),
    webhooksRoutes = require('./routes/webhooks'),
//middleware
    utilMiddleware = require('./middleware/util'),
//variables
    port = process.env.NODE_PORT || 3001;

var app = express();

/**
 * settings
 */

//cors
app.use(cors());
app.options('*', cors());

//security extensions
app.use(helmet());
app.use(contentLength.validateMax({max: 9999}));

//gzip
app.use(compression({
    // only compress files for the following content types
    filter: function(req, res) {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    // zlib option for compression level
    level: 3
}));

//helper middleware
redirect(app);
app.use(utilMiddleware.removeTrailingSlashes,utilMiddleware.forceLowercaseRoutes);
app = utilMiddleware.debugLibraries(app, express);
app.use(utilMiddleware.debugRequests);

//parse form data
app.use(bodyParser.json());// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true // to support URL-encoded bodies
}));
app.use(expressValidator());

//user sessions
app.use(cookieParser());
app.use(passport.initialize());

/**
 * routes
 */
app.use('/users', usersRoutes);
app.use('/webhooks', webhooksRoutes);


/**
 * error handlers
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    //404 handler
    next(new errorService.NotFoundError(req.method+' '+req.originalUrl));
});

// error handlers
app.use(function (error, req, res, next) {
    logService.error(error);
    if(utilService.isLocalConfig()){
        res.status(utilService.status.internalServerError).send(error);
    } else {
        res.status(utilService.status.internalServerError).send('An error occurred. Please check the route and parameters');
    }
});


/**
 *  Start server
 */
app.listen(port, function() {
    logService.info('API server started on port '+port+' at '+moment().format());
});