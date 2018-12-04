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
    // Verify the data
    var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 && helper.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;
    var password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var address = typeof (data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;


    if (name && email && address) {
        // Make sure the file already does not exist
        _data.read('users', email, function (err, data) {
            if (err) {
                var hashedPassword = helper.encrypt(password);
                if (hashedPassword) {
                    var userData = {
                        name,
                        email,
                        hashedPassword,
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
                        'Error': 'Password did not match'
                    });
                }
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
    var email = typeof (data.queryString.email) === 'string' && data.queryString.email.trim().length > 0 && helper.validateEmail(data.queryString.email.trim()) ? data.queryString.email.trim() : false;

    if (email) {
        // Read the user data
        _data.read('users', email, function (err, userData) {
            if (!err && userData) {
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
// Optional input: name, address, password (At least one)
handler._users.put = function (data, callback) {
    // Verify the data
    var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 && helper.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;

    // Check for optional field
    var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var address = typeof (data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    var password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Check if the required paramtert has been passed and is valid
    if (email) {
        // Check if the optional parameters has been passed and is valid
        if (name || address || password) {
            // Read the user details
            _data.read('users', email, function (err, userData) {
                if (!err && userData) {
                    var tempUserData = userData;
                    if (name) {
                        tempUserData.name = name;
                    }
                    if (address) {
                        tempUserData.address = address;
                    }
                    if (password) {
                        let tempPassword = helper.encrypt(password);
                        tempUserData.hashedPassword = tempPassword;
                    }

                    // Update the user data
                    _data.update('users', email, tempUserData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {
                                'Error': 'Could not update the users detail'
                            })
                        }
                    });
                } else {
                    callback(400, {
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


// User - DELETE
// Required input: email
// Optional input: none
// @TODO Cleanup (delete) any other data files associated with this user
handler._users.delete = function (data, callback) {
    // validate the input
    var email = typeof (data.queryString.email) === 'string' && data.queryString.email.trim().length > 0 && helper.validateEmail(data.queryString.email.trim()) ? data.queryString.email.trim() : false;

    if (email) {
        // Read the user data
        _data.read('users', email, function (err, userData) {
            if (!err && userData) {
                _data.delete('users', email, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            'Error': 'Could not delete the user'
                        });
                    }
                })
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

handler.tokens = function (data, callback) {
    var methods = ['get', 'post', 'put', 'delete'];

    if (methods.indexOf(data.method) > -1) {
        handler._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
}

handler._tokens = {};

// Tokens - POST
// Required input: email, password
// Optional input: none
handler._tokens.post = function (data, callback) {
    // Validate the input
    var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 && helper.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;
    var password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (email && password) {
        // Verify if the user exists
        _data.read('users', email, function (err, userData) {
            if (!err && userData) {
                var hashedPassword = helper.encrypt(password);
                if (hashedPassword === userData.hashedPassword) {
                    // If valid create a new token with a random name. Set expiration date 1 hour in the future
                    var tokenId = helper.generateRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;

                    var tokenData = {
                        email,
                        tokenId,
                        expires
                    };

                    _data.create('tokens', tokenId, tokenData, function (err) {
                        if (!err) {
                            callback(200, tokenData);
                        } else {
                            callback(500, {
                                'Error': 'Could not create new token'
                            });
                        }
                    });
                } else {
                    callback(400, {
                        'Error': 'Invalid user credentials'
                    });
                }
            } else {
                callback(404, {
                    'Error': 'User does not exist'
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Invalid user input'
        })
    }
}

// Tokens - GET
// Required input: tokenId
// Optional input: none
handler._tokens.get = function (data, callback) {
    // Verify the input
    var tokenId = typeof (data.queryString.id) === 'string' && data.queryString.id.trim().length === 20 ? data.queryString.id.trim() : false;

    if (tokenId) {
        // Read the token data
        _data.read('tokens', tokenId, function (err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404, {
                    Error: 'The token does not exist.'
                })
            }
        });
    } else {
        callback(400, {
            Error: 'Missing required field'
        })
    }
}

// Tokens - PUT
// Required input: tokenId, extend
// Optional input: none
handler._tokens.put = function (data, callback) {
    // Verify the input
    var tokenId = typeof (data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
    var extend = typeof (data.payload.extend) === 'boolean' && data.payload.extend == true ? data.payload.id.trim() : false;

    if (tokenId && extend) {
        // Check if the token exists
        _data.read('tokens', tokenId, function (err, tokenData) {
            if (!err && tokenData) {
                // Check if the token has expired or not
                if (tokenData.expires > Date.now()) {
                    // Extend the token for 1 hour
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    _data.update('tokens', tokenId, tokenData, function(err) {
                        if(!err) {
                            callback(200);
                        } else {
                            callback(400, {
                                Error: 'Could not extend the token'
                            })
                        }
                    });
                } else {
                    callback(400, {
                        Error: 'Token has expired and cannot be  extended'
                    })
                }
            } else {
                callback(404, {
                    Error: 'Token does not exist'
                })
            }
        });
    } else {
        callback(400, {
            Error: 'Missing required field'
        });
    }
}

// Tokens - DELETE
// Required input: tokenId
// Optional input: none
handler._tokens.delete = function (data, callback) {
    // Verify the input
    var tokenId = typeof (data.queryString.id) === 'string' && data.queryString.id.trim().length === 20 ? data.queryString.id.trim() : false;

    if (tokenId) {
        // Verify if the token exists
        _data.read('tokens', tokenId, function (err, tokenData) {
            if (!err && tokenData) {
                _data.delete('tokens', tokenId, function(err) {
                    if(!err) {
                        callback(200);
                    } else {
                        callback(500, {
                            Error: 'Could not delete the token.'
                        })
                    }
                })
            } else {
                callback(404, {
                    Error: 'The token does not exist.'
                })
            }
        });
    } else {
        callback(400, {
            Error: 'Missing required field'
        })
    }
}

module.exports = handler;