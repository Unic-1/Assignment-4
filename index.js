/**
 * This is the entry point for the `api`
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');
var { StringDecoder } = require('string_decoder');
var util = require('util');
var debug = util.debuglog('server');
var cli = require('./lib/cli');


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
    var header = req.headers;

    // If there is payload
    var decoder = new StringDecoder('utf8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        console.log('Path', finalPath);
        // Choose the handler this should go to. If one is not found go to notFound handler
        var chooseHandler = typeof (app.router[finalPath]) !== undefined ? app.router[finalPath] : handler.notFound;

        // If the request is within the public directory, use the public handler instead
        chooseHandler = finalPath.indexOf('public/') > -1 ? handler.public : chooseHandler;

        // Construct the data object to send
        var data = {
            'path': finalPath,
            method,
            queryString,
            'payload': helper.parseJsonToObject(buffer),
            header
        };

        // Route the request to the handler specified in the router
        chooseHandler(data, function (statusCode, payload, contentType) {
            // Determine the type of response (fallback to JSON)
            contentType = typeof (contentType) === 'string' ? contentType : 'json';

            // Use the status code called back by the handler,  or default to 200
            statusCode = typeof (statusCode) === 'number' ? statusCode : 200;

            // Convert the payload to string
            var payloadString = '';

            if (contentType === 'json') {
                //Use the payload called back by the handler, or default to empty object
                payload = typeof (payload) == 'object' ? payload : {};

                // Convert the payload to a string
                payloadString = JSON.stringify(payload);

                res.setHeader('Content-Type', 'application/json');
            }

            if(contentType === 'html') {
                res.setHeader('Contetnt-Type', 'text/html');
                payloadString = typeof(payload)  === 'string' ? payload : '';
            }
            if(contentType === 'favicon') {
                res.setHeader('Contetnt-Type', 'image/x-icon');
                payloadString = typeof(payload)  != 'undefined' ? payload : '';
            }
            if(contentType === 'css') {
                res.setHeader('Contetnt-Type', 'text/css');
                payloadString = typeof(payload)  != 'undefined' ? payload : '';
            }
            if(contentType === 'png') {
                res.setHeader('Contetnt-Type', 'image/png');
                payloadString = typeof(payload)  != 'undefined' ? payload : '';
            }
            if(contentType === 'jpg') {
                res.setHeader('Contetnt-Type', 'image/jpeg');
                payloadString = typeof(payload)  != 'undefined' ? payload : '';
            }
            if(contentType === 'plain') {
                res.setHeader('Contetnt-Type', 'text/plain');
                payloadString = typeof(payload)  != 'undefined' ? payload : '';
            }

            // Return the response
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

setTimeout(function() {
    cli.init();
}, 50);

app.router = {
    'users': handler.users,
    'token': handler.tokens,
    'menu': handler.menu,
    'menuList': handler.menuList,
    'cart': handler.cart,
    'pay': handler.pay,
    'order': handler.order,
    'orderList': handler.orderList,
    'login': handler.login,
    'logout': handler.logout,
    '': handler.index,
    'account/create': handler.accoutnCreate,
    'account/edit': handler.accountEdit,
    'account/deleted': handler.accountDeleted,
    'session/create': handler.sessionCreate,
    'session/deleted': handler.sessionDeleted,
    'cart/all': handler.cartList,
    'item/menu': handler.viewMenu,
    'item/edit': handler.editItem,
    'order/pay': handler.payment,
    'order/all': handler.myorder,
    'order': handler.order,
    'favicon.ico': handler.favicon,
    'public': handler.public
}

module.export = app;