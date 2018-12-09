/**
 * Helper functions
 * 
 */


// Dependencies
var crypto  = require('crypto');
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
}

module.exports = helper;