/**
 * Helper functions
 * 
 */


// Dependencies




var helper = {};

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

module.exports = helper;