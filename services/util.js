let util = {};

util.status = {
    ok: 200,
    created: 201,
    accepted: 202,
    noContent: 204,
    movedPermanently: 301,
    temporaryRedirect: 307,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
    serviceUnavailable: 503
};

/**
 * Helper Functions ----------------------------------------------------------
 */

util.nullCheck = function(object,key){
    return object && object.hasOwnProperty(key) && (object[key] || object[key] === 0)?true:false;
};

util.getValueByKey = function(object, key){
    return util.nullCheck(object,key)?object[key]:'';
};

util.getFirstValueByKey = function(object, key){
    return util.nullCheck(object,key)?object[key][0]:'';
};

util.isLocalConfig = function(){
    return process.env.NODE_ENV === 'local';
};

module.exports = util;