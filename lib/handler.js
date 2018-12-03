/**
 * Handler for api calls
 * 
 */

// Dependencies
var fs = require('fs');
var helper = require('./helper');
var _data = require('./data');



var handler = {};

handler.notFound = function (data, callback) {
    callback(404);
}

handler.users = function (data, callback) {
    var methods = ['get', 'post', 'put', 'delete'];

    if (methods.indexOf(data.method) > -1) {
        handler._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handler._users = {};

// User - POST
handler._users.post = function (data, callback) {
    console.log(data);
    // Verify the data
    var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 && helper.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;
    var address = typeof (data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;

    if (name && email && address) {
        // Make sure the file already does not exist
        _data.read('users', email, function (err, data) {
            if (err) {
                var userData = {
                    name,
                    email,
                    address
                };

                // Store the user details
                _data.create('users', email, userData, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        console.log(err);
                        callback(500, {
                            'Error': 'Could not creat the new user'
                        });
                    }
                });
            } else {
                callback(400, {
                    'Error': 'User with the same email already exists'
                });
            }
        });

    } else {
        callback(400, {
            'Error': 'Invalid user inputs'
        });
    }
}

// User - GET
// Required input: email
// Optional input: none
handler._users.get = function (data, callback) {
    // validate the input
    var email = typeof(data.queryString.email) === 'string' && data.queryString.email.trim().length  > 0 && helper.validateEmail(data.queryString.email.trim()) ? data.queryString.email.trim() : false;

    if(email) {
        // Read the user data
        _data.read('users', email, function(err, userData) {
            if(!err &&  userData) {
                callback(200, userData);
            } else {
                callback(500, {
                    'Error': 'Could not read user data'
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Invalid user input'
        })
    }
}


// User - PUT
// Required input: email
// Optional input: name, address (At least one)
handler._users.put = function (data, callback) {
    // Verify the data
    var  email = typeof(data.payload.email) ===  'string' &&  data.payload.email.trim().length > 0 && helper.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;

    // Check for optional field
    var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var address = typeof (data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;

    // Check if the required paramtert has been passed and is valid
    if(email) {
        // Check if the optional parameters has been passed and is valid
        if(name || address) {
            // Read the user details
            _data.read('users', email, function(err, userData) {
                if(!err && userData) {
                    var tempUserData = userData;
                    if(name) {
                        tempUserData.name = name;
                    }
                    if(address) {
                        tempUserData.address = address;
                    }
    
                    // Update the user data
                    _data.update('users', email, tempUserData, function(err) {
                        if(!err) {
                            callback(200);
                        } else {
                            callback(500, {
                                'Error': 'Could not update the users detail'
                            })
                        }
                    });
                } else {
                    callback(400,  {
                        'Error': 'Could not read the user data. The user might not exist'
                    });
                }
            }); 
        } else {
            callback(400, {
                'Error': 'At least one optional parameter is needed'
            });
        }
    } else {
        callback(400, {
            'Error': 'Required parameter is missing'
        });
    }
}

handler._users.delete = function (data, callback) {

}



module.exports = handler;