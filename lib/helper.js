/**
 * Helper functions
 * 
 */


// Dependencies
var crypto  = require('crypto');
var config = require('./config');


var helper = {};

helper.encrypt = function(str) {
    if(typeof(str) === 'string' && str.length > 0) {
        var hash  = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
}

helper.parseJsonToObject = function (data) {
    try {
        var obj = JSON.parse(data);
        console.log(obj);
        return obj;
    } catch (e) {
        return {};
    }
};

helper.parseObjectToString = function (data) {
    try {
        var str = JSON.stringify(data);
        return str;
    } catch (e) {
        return '';
    }
}

helper.createFilePath = function (baseDir, dir, fileName) {
    return baseDir + dir + '/' + fileName + '.json';
};

helper.validateEmail = function (email) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    return reg.test(email);
}

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

module.exports = helper;