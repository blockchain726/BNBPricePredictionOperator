const fs = require('fs');
const mongoose = require("mongoose");
//const RedisServer = require('redis-server');
const env =
        fs.existsSync('./config/config.prod.json')? "prod" :
        fs.existsSync('./config/config.development.json')? "development" :
        fs.existsSync('./config/config.uat.json')? "uat" :
        "local";
var config
var envConfig
var uri
var connection

try {
    if (env === 'production' || env === 'prod'){
        config = require('./config.prod.json');
    } else if (env === 'development'){
        config = require('./config.development.json');
    }  else if (env === 'uat'){
        config = require('./config.uat.json');
    }
    else {
        config = require('./config.json');
    }

    envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
         process.env[key] = ((typeof envConfig[key] === 'object')? JSON.stringify(envConfig[key]) : envConfig[key]);
    });
    const dbPrefix = JSON.parse(process.env["DB"]).prefix;
    const dbUsername = JSON.parse(process.env["DB"]).username;
    const dbPassword = JSON.parse(process.env["DB"]).password;
    const dbHost = JSON.parse(process.env["DB"]).host;
    const dbName = JSON.parse(process.env["DB"]).database;
    const uri = dbPrefix + dbUsername + ":" + dbPassword + "@" + dbHost + "/" + dbName;
    //const server = new RedisServer(6379);

    mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    connection = mongoose.connection;
    connection.once("open", function() {
        console.log("MongoDB database connection established successfully");
    });

    // server.open((err) => {
    //     if (err === null) {
    //     }
    // });
} catch(e) {
    console.log(e);

    console.log('Error: Could not find configuration file. Please create config.json file, base it from config.json.example');
    process.exit(1);
}

module.exports = { config, connection };
