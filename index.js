/**
 * This is the entry point for the api
 * 
 */

// Dependencies
var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');
var {
    StringDecoder
} = require('string_decoder');
var util = require('util');
var debug = util.debuglog('server');


var config = require('./lib/config');
var handler = require('./lib/handler');
var helper = require('./lib/helper');



var app = {};

app.httpServer = http.createServer(function (req, res) {
    app.unifiedServer(req, res);
});

var authOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/certificate.pem')
}

app.httpsServer = https.createServer(authOptions, function (req, res) {
    app.unifiedServer(req, res);
});

// Handles the http and https request
app.unifiedServer = function (req, res) {
    var parseUrl = url.parse(req.url, true);

    var path = parseUrl.pathname;
    var finalPath = path.replace(/^\/+|\/+$/g, '');

    // Get the request method
    var method = req.method.toLowerCase();

    // Get query as an object
    var queryString = parseUrl.query;

    // get the header as an object
    var header = req.header;

    // If there is payload
    var decoder = new StringDecoder('utf8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        // Choose the handler this should go to. If one is not found go to notFound handler
        var chooseHandler = typeof (app.router[finalPath]) !== undefined ? app.router[finalPath] : handler.notFound;

        // Construct the data object to send
        var data = {
            'path': finalPath,
            method,
            queryString,
            'payload': helper.parseJsonToObject(buffer),
            header
        };

        // Route the request to the handler specified in the router
        chooseHandler(data, function (statusCode, payload) {
            // Use the status code called back by the handler,  or default to 200
            statusCode = typeof (statusCode) === 'number' ? statusCode : 200;

            // Use the payload  called  back  by  theh handler, or  default to empty object
            payload = typeof (payload) === 'object' ? payload : {};

            // Convert the payload to string
            var payloadString = helper.parseObjectToString(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the response
            // If the response is 200, print green other wise pring red
            if (statusCode == 200) {
                debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + finalPath + ' ' + statusCode);
            } else {
                debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + finalPath + ' ' + statusCode);
            }
        });
    });
}

app.httpServer.listen(config.httpPort, function () {
    console.log('http server is listening on port ' + config.httpPort);
});

app.httpsServer.listen(config.httpsPort, function () {
    console.log('https server is listening on port ' + config.httpsPort);
});



app.router = {
    'users': handler.users
}

module.export = app;