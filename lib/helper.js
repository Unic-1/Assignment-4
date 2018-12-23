/**
 * Helper functions
 *
 */


// Dependencies
var crypto  = require('crypto');
var path = require('path');
var fs = require('fs');
var config = require('./config');

var helper = {};

// Encrypt the string in hmac format
helper.encrypt = function(str) {
    if(typeof(str) === 'string' && str.length > 0) {
        var hash  = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
}

// Parse string to json object
helper.parseJsonToObject = function (data) {
    try {
        var obj = JSON.parse(data);
        return obj;
    } catch (e) {
        return {};
    }
};

// Parse json object to string
helper.parseObjectToString = function (data) {
    try {
        var str = JSON.stringify(data);
        return str;
    } catch (e) {
        return '';
    }
}

// Create the file path
helper.createFilePath = function (baseDir, dir, fileName) {
    return baseDir + dir + '/' + fileName + '.json';
};

// Validate email using regex
helper.validateEmail = function (email) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    return reg.test(email);
}

// Generated random string of specified length
helper.generateRandomString = function(len) {
    let strLength  = typeof(len) == 'number' && len > 0 ? len: false;
    if(strLength) {
        // Drfine all the possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        //Start the final string
        var str = '';
        for(i = 1; i<= strLength; i++)  {
            // Get a random character from the possibleCharaters string
            var randomCharacter  = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the final string
            str += randomCharacter;
        }

        // Return the final string
        return str;
    } else {
        return false;
    }
}

// Generate random numeric ID of specified length
helper.generateRandomId = function(len) {
    let strLength  = typeof(len) == 'number' && len > 0 ? len: false;
    if(strLength) {
        // Drfine all the possible characters that could go into a string
        var possibleCharacters = '0123456789';

        //Start the final string
        var str = '';
        for(i = 1; i<= strLength; i++)  {
            // Get a random character from the possibleCharaters string
            var randomCharacter  = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the final string
            str += randomCharacter;
        }

        // Return the final string
        return str;
    } else {
        return false;
    }
}

// Generates a structure for the mail
helper.generateMailStructure = function(data) {
    var template = '<!DOCTYPE html>'+
'<html lang="en">'+
'<head>'+
    '<meta charset="UTF-8">'+
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">'+
    '<meta http-equiv="X-UA-Compatible" content="ie=edge">'+
    '<style>'+
    'table {'+
  'font-family: arial, sans-serif;'+
  'border-collapse: collapse;'+
  'width: 100%;'+
'}'+

'td, th {'+
  'border: 1px solid #dddddd;'+
  'text-align: left;'+
  'padding: 8px;'+
'}'+

'tr:last-child {'+
  'background-color: #dddddd;'+
'}'+
'</style>'+
'</head>'+
'<body>'+
    '<h1>Hi '+data.name+'</h1>'+

    '<p>    Your order for the following items has been placed: </p>'+

    '<table>'+
        '<tr>'+
            '<th>Item</th>'+
            '<th>Quantity</th>'+
            '<th>Price</th>'+
        '</tr>';

        var total = 0;
        Object.keys(data.item).forEach((itemName) => {
            template += '<tr>'+
            '<td>'+itemName+'</td>'+
            '<td>'+data.item[itemName].quantity+'</td>'+
            '<td>'+data.item[itemName].total+'</td>'+
        '</tr>';
        total+= data.item[itemName].total;
        });

        template += '<tr>'+
        '<td colspan="2">Total</td>'+
        '<td>'+total+'</td>'+
        '</tr>';

    template += '</table>';

    var date = new Date(data.deliverTime);
    var filteredDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':00';

    template += '<h4>Your will can expect your order by '+filteredDate+'</h4>'+
    '<h4>Your order id is: '+data.id+'</h4>'+
'</body>'+
'</html>"';

return template;
};


// Get the string content of a template
helper.getTemplate = function (templateName, data, callback) {
    templateName = typeof (templateName) === 'string' && templateName.length > 0 ? templateName : false;
    data = typeof (data) === 'object' && data !== null ? data : {};

    if (templateName) {
        var templatesDir = path.join(__dirname, '/../templates/');

        fs.readFile(templatesDir + templateName + '.html', 'utf8', function (err, str) {
            if (!err && str && str.length > 0) {
                // Do interpolation on the string
                var finalString = helper.interpolate(str, data);
                callback(false, finalString);
            } else {
                callback('No template could be found');
            }
        })
    } else {
        callback('A valid template name was not specified');
    }
};

// Add the universal header and footer to a string, and pass provided data object to  the header and footer for interpolstion
helper.addUniversalTemplates = function (str, data, callback) {
    str = typeof (str) === 'string' && str.length > 0 ? str : '';
    data = typeof (data) === 'object' && data !== null ? data : {};

    // Get the header
    helper.getTemplate('_header', data, function (err, headerString) {
        if (!err && headerString) {
            // Get the footer
            helper.getTemplate('_footer', data, function (err, footerString) {
                if (!err && footerString) {
                    // Add them all together
                    var fullString = headerString + str + footerString;
                    callback(false, fullString);
                } else {
                    callback('Could not find the footer template');
                }
            });
        } else {
            callback('Could not find the header template');
        }
    });
}

// Take a given string and a data object and find/replace all the key within it
helper.interpolate = function (str, data) {
    str = typeof (str) === 'string' && str.length > 0 ? str : '';
    data = typeof (data) === 'object' && data !== null ? data : {};

    // Add the templateGlobals to the data object, prepending their key name with "global"
    for (var keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.' + keyName] = config.templateGlobals[keyName];
        }
    }

    // For each key in the data object, insert its value into the string at the  corresponding data holder
    for (var key in data) {
        if (data.hasOwnProperty(key) && typeof (data[key]) === 'string') {
            var replace = data[key];
            var find = '{' + key + '}';
            str = str.replace(find, replace);
        }
    }
    return str;
}

// Get the contents of a static (public asset)
helper.getStaticAssets = function(fileName, callback) {
    fileName = typeof(fileName) === 'string' && fileName.length > 0 ? fileName : false;

    if(fileName) {
        var publicDir = path.join(__dirname,'/../public/');
        fs.readFile(publicDir+fileName, function(err, data) {
            if(!err && data) {
                callback(false, data);
            } else {
                callback('No file could be found');
            }
        })
    } else {
        callback('A valid file name was not specified');
    }
}

module.exports = helper;