const //services
    utilService = require('./util'),
    //packages
    knex = require('knex')({
        client: 'mysql',
        connection: {
            host : process.env.MYSQL_HOST,
            user : process.env.MYSQL_USER,
            password : process.env.MYSQL_PASSWORD,
            database : process.env.MYSQL_DATABASE
        },
        debug: utilService.isLocalConfig()
    });

module.exports = knex;