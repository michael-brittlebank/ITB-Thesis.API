const //packages
    promise = require('bluebird'),
    mailgun = promise.promisifyAll(require('mailgun-js')({apiKey: process.env.EMAIL_API_KEY, domain: process.env.EMAIL_DOMAIN})),
//services
    logService = require('./log'),
    utilService = require('./util');

let emailService = {};

emailService.sendMail = function(data) {
    if (!utilService.nullCheck(data, 'from')){
        data.from = process.env.EMAIL_SENDER;
    }
    if (utilService.nullCheck(data,'to') && utilService.nullCheck(data,'subject') && utilService.nullCheck(data,'text')){//todo, && utilService.nullCheck(data,'html')){
        return mailgun.messages().send(data)
            .then(function (response) {
                return promise.resolve();
            })
            .catch(function(error){
                logService.error('emailService.sendMail()', error);
                return promise.reject(error);
            });
    } else {
        throw new Error('emailService.sendMail() Missing mail parameters');
    }
};

module.exports = emailService;