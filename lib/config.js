/**
 * Stores all the configuration details for the server
 * 
 */

var environment = {};

environment.staging  =  {
    httpPort: 3000,
    httpsPort: 3001
}

environment.production = {
    httpPort: 5000,
    httpsPort: 5001
}

var currentEnv = typeof(process.env.NODE_ENV) === 'string' ?
process.env.NODE_ENV.toLowerCase() : '';

var serverConfig = typeof(environment[currentEnv]) === 'object' ?  environment[currentEnv] : environment.staging;

module.exports = serverConfig