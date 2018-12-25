/**
 * Handler for api calls
 *
 */

// Dependencies
var helper = require('./helper');
var _data = require('./data');
var config = require('./config');
var http = require('https');
var querystring = require('querystring');

var handler = {};

// Index Handler
handler.index = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Uptime Monitoring - Made Simple',
      'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down, we\'ll send you a text to let you know',
      'body.class': 'index'
    };

    // Read in a templeate as a string
    helper.getTemplate('index', templateData, function (err, str) {
      // console.log(err, str);
      if (!err && str) {

        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, fullString) {
          //    console.log(err, fullString);
          if (!err && fullString) {
            callback(200, fullString, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        })
      } else {
        callback(500, undefined, 'html');
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}

// Show Menu
handler.viewMenu = function (data, callback) {
  console.log('Show menu');
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Menu | Best Pizza',
      'head.description': 'We provide the best pizza with loaded cheese and topings',
      'body.class': 'viewMenu'
    };

    // Read in a templeate as a string
    helper.getTemplate('viewMenu', templateData, function (err, str) {
      // console.log(err, str);
      if (!err && str) {

        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, fullString) {
          //    console.log(err, fullString);
          if (!err && fullString) {
            callback(200, fullString, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        })
      } else {
        callback(500, undefined, 'html');
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}

// Show Menu
handler.editItem = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Menu | Best Pizza',
      'head.description': 'We provide the best pizza with loaded cheese and topings',
      'body.class': 'editItem'
    };

    // Read in a templeate as a string
    helper.getTemplate('editItem', templateData, function (err, str) {
      // console.log(err, str);
      if (!err && str) {

        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, fullString) {
          //    console.log(err, fullString);
          if (!err && fullString) {
            callback(200, fullString, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        })
      } else {
        callback(500, undefined, 'html');
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}

// Create Account
handler.accoutnCreate = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Create an Account',
      'head.description': 'Sign up is easy and only takes a few seconds',
      'body.class': 'accountCreate'
    };

    // Read in a templeate as a string
    helper.getTemplate('accountCreate', templateData, function (err, str) {
      // console.log(err, str);
      if (!err && str) {

        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, fullString) {
          console.log(err, fullString);
          if (!err && fullString) {
            callback(200, fullString, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        })
      } else {
        callback(500, undefined, 'html');
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}

// Create Session
handler.sessionCreate = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Login to your acocunt',
      'head.description': 'Please enter your phone number and password to access your account',
      'body.class': 'sessionCreate'
    };

    // Read in a templeate as a string
    helper.getTemplate('sessionCreate', templateData, function (err, str) {
      // console.log(err, str);
      if (!err && str) {

        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, fullString) {
          console.log(err, fullString);
          if (!err && fullString) {
            callback(200, fullString, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        })
      } else {
        callback(500, undefined, 'html');
      }
    })
  } else {
    callback(405, undefined, 'html');
  }
}

// Edit Your Account
handler.accountEdit = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Account Settings',
      'body.class': 'accountEdit'
    };
    // Read in a template as a string
    helper.getTemplate('accountEdit', templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Session has been deleted
handler.sessionDeleted = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Logged Out',
      'head.description': 'You have been logged out of your account.',
      'body.class': 'sessionDeleted'
    };
    // Read in a template as a string
    helper.getTemplate('sessionDeleted', templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Account has been deleted
handler.accountDeleted = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Account Deleted',
      'head.description': 'Your account has been deleted.',
      'body.class': 'accountDeleted'
    };
    // Read in a template as a string
    helper.getTemplate('accountDeleted', templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Dashboard (view all cart item)
handler.cartList = function (data, callback) {
  console.log('Caret List');
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Dashboard',
      'body.class': 'cartList'
    };
    // Read in a template as a string
    helper.getTemplate('cartList', templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Payment
handler.payment = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'Payment | Order',
      'body.class': 'payment'
    };
    // Read in a template as a string
    helper.getTemplate('payment', templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Payment
handler.myorder = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    var templateData = {
      'head.title': 'My Order | Order',
      'body.class': 'order'
    };
    // Read in a template as a string
    helper.getTemplate('orderList', templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helper.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
}

// Favicon
handler.favicon = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Read in the favicon's data
    helper.getStaticAssets('favicon.ico', function (err, data) {
      if (!err && data) {
        // Callback the data
        callback(200, data, 'favicon');
      } else {
        callback(500);
      }
    })
  } else {
    callback(405);
  }
}

// Public
handler.public = function (data, callback) {
  // Reject ay request that isn't a GET
  if (data.method === 'get') {
    // Get the filename being requested
    var trimmedAssetName = data.path.replace('public/', '').trim();
    if (trimmedAssetName.length > 0) {
      // Read in the asset's data
      helper.getStaticAssets(trimmedAssetName, function (err, data) {
        if (!err && data) {
          // Determine the content type (default ot plain text)
          var contentType = 'plain';

          if (trimmedAssetName.indexOf('.css') > -1) {
            contentType = 'css';
          }

          if (trimmedAssetName.indexOf('.png') > -1) {
            contentType = 'png';
          }

          if (trimmedAssetName.indexOf('.jpg') > -1) {
            contentType = 'jpg';
          }

          if (trimmedAssetName.indexOf('.ico') > -1) {
            contentType = 'ico';
          }

          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      })
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
}


/*
 * JSON API Handlers
 *
 */

// Handles the request if the path is not found
handler.notFound = function (data, callback) {
  callback(404);
}

// Handle user related methods
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
  // Verify the input
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
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;

  if (email) {
    if (token) {
      // Verify the token
      handler._tokens.verifyToken(token, email, function (isValid) {
        if (isValid) {
          // Read the user data
          _data.read('users', email, function (err, userData) {
            if (!err && userData) {
              delete userData.hashedPassword;
              callback(200, userData);
            } else {
              callback(500, {
                'Error': 'Could not read user data'
              });
            }
          });
        } else {
          callback(403, {
            Error: 'The  token is invalid'
          });
        }
      })
    } else {
      callback(403, {
        Error: 'Token  is required'
      });
    }
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
  // Verify the input
  var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 && helper.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;

  // Check for optional field
  var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
  var address = typeof (data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
  var password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Check if the required parameter has been passed and is valid
  if (email) {
    // Check if the optional parameters has been passed and is valid
    if (name || address || password) {
      // Check if the token is provided on not
      if (token) {
        // Verify the token
        handler._tokens.verifyToken(token, email, function (isValid) {
          if (isValid) {
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
            callback(403, {
              Error: 'The token is invalid'
            })
          }
        })
      } else {
        callback(403, {
          Error: 'Token is required'
        })
      }
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
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;

  if (email) {
    // Check if the token is porvided
    if (token) {
      // Verify the token
      handler._tokens.verifyToken(token, email, function (isValid) {
        if (isValid) {
          // Read the user data
          _data.read('users', email, function (err, userData) {
            if (!err && userData) {
              // Delete the user
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
          callback(403, {
            Error: 'The token is invalid'
          });
        }
      });
    } else {
      callback(403, {
        Error: 'Token is required'
      });
    }
  } else {
    callback(400, {
      'Error': 'Invalid user input'
    });
  }
}

// Handle all the token related methods
handler.tokens = function (data, callback) {
  var methods = ['get', 'post', 'put', 'delete'];

  if (methods.indexOf(data.method) > -1) {
    handler._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
}

handler._tokens = {};

// Verify if the token is valid or not
handler._tokens.verifyToken = function (tokenId, email, callback) {
  // Read the token data
  _data.read('tokens', tokenId, function (err, tokenData) {
    if (!err && tokenData) {
      // Verify if the token is valid
      if (tokenData.email === email && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
}


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
        // Hash the password
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

          // Store the token data
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
  var extend = typeof (data.payload.extend) === 'boolean' && data.payload.extend == true ? data.payload.extend : false;

  if (tokenId && extend) {
    // Check if the token exists
    _data.read('tokens', tokenId, function (err, tokenData) {
      if (!err && tokenData) {
        // Check if the token has expired or not
        if (tokenData.expires > Date.now()) {
          // Extend the token for 1 hour
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          // Update the token
          _data.update('tokens', tokenId, tokenData, function (err) {
            if (!err) {
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
        // Delete the token
        _data.delete('tokens', tokenId, function (err) {
          if (!err) {
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

// Handle all the menu related method
handler.menu = function (data, callback) {
  var methods = ['get', 'post', 'put', 'delete'];

  if (methods.indexOf(data.method) > -1) {
    handler._menu[data.method](data, callback);
  } else {
    callback(405);
  }
}

handler._menu = {};


// Menu - POST
// Required input: itemName, price
// Optional input: none
handler._menu.post = function (data, callback) {
  // Verify the input
  var itemName = typeof (data.payload.itemName) === 'string' && data.payload.itemName.trim().length > 0 ? data.payload.itemName.trim() : false;
  var price = typeof (data.payload.price) === 'number' && data.payload.price > 0 ? data.payload.price : false;

  if (itemName && price) {
    var item = {
      itemName,
      price
    };
    // Insert the item into the menu
    _data.create('menu', itemName, item, function (err) {
      if (!err) {
        callback(200);
      } else {
        callback(500, {
          Error: 'Could not insert the item into the menu'
        })
      }
    });
  } else {
    callback(400, {
      Error: 'Missing required parameters'
    })
  }
}

// Menu - GET
// Required input: itemName
// Optional input: none
handler._menu.get = function (data, callback) {
  // Verify the input
  var itemName = typeof (data.queryString.itemName) === 'string' && data.queryString.itemName.trim().length > 0 ? data.queryString.itemName.trim() : false;

  if (itemName) {
    // Read the data
    _data.read('menu', itemName, function (err, itemData) {
      if (!err && itemData) {
        callback(200, itemData);
      } else {
        callback(500, {
          Error: 'Could not find the item'
        })
      }
    });
  } else {
    callback(400, {
      Error: 'Missing required parameter'
    })
  }
}

// Menu - PUT
// Required input: itemName
// Optional input: price (At least one)
handler._menu.put = function (data, callback) {
  // Verify the input
  var itemName = typeof (data.payload.itemName) === 'string' && data.payload.itemName.trim().length > 0 ? data.payload.itemName.trim() : false;

  // Verifyt the optional input
  var price = typeof (data.payload.price) === 'number' && data.payload.price > 0 ? data.payload.price : false;

  if (itemName) {
    if (price) {
      // Read the data
      _data.read('menu', itemName, function (err, itemData) {
        if (!err && itemData) {
          itemData.price = price;

          // Update the item details
          _data.update('menu', itemName, itemData, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: 'Could not update the item'
              })
            }
          })
        } else {
          callback(404, {
            Error: 'Item does not exist'
          })
        }
      });
    } else {
      callback(400, {
        Error: 'Atleast one optional parameter is required'
      })
    }
  } else {
    callback(400, {
      Error: 'Missing required parameter'
    })
  }
}

// Menu - DELETE
// Required input: itemName
// Optional input: none
handler._menu.delete = function (data, callback) {
  // Verify the input
  var itemName = typeof (data.queryString.itemName) === 'string' && data.queryString.itemName.trim().length > 0 ? data.queryString.itemName.trim() : false;

  if (itemName) {
    // Check  if the item exists
    _data.read('menu', itemName, function (err, itemData) {
      if (!err && itemData) {
        // Delete the item form the menu
        _data.delete('menu', itemName, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, {
              Error: 'Could not delete the item'
            })
          }
        });
      } else {
        callback(404, {
          Error: 'The item does not exist'
        })
      }
    });
  } else {
    callback(400, {
      Error: 'Missing required parameter'
    })
  }
}

// Login - POST
// Required input: email, password
// Optional input: none
handler.login = function (data, callback) {
  var methods = ['post'];

  if (methods.indexOf(data.method) > -1) {
    handler._tokens.post(data, function (state, message) {
      callback(state, message);
    });
  } else {
    callback(405);
  }
}

// Logout - DELETE
// Required input: tokenId
// Optional input: none
handler.logout = function (data, callback) {
  var methods = ['delete'];

  if (methods.indexOf(data.method) > -1) {
    handler._tokens.delete(data, function (state, message) {
      if (state === 200)
        callback(state);
      else
        callback(state, message);
    });
  } else {
    callback(405);
  }
}

// Handles the menu list requests
handler.menuList = function (data, callback) {
  var methods = ['get'];

  if (methods.indexOf(data.method) > -1) {
    handler._menuList[data.method](data, callback);
  } else {
    callback(405);
  }
}

handler._menuList = {};

// MenuList - GET
// Required input: tokenId
// Optional input: none
handler._menuList.get = function (data, callback) {
  // Validate the input
  var email = typeof (data.queryString.email) === 'string' && data.queryString.email.trim().length > 0 && helper.validateEmail(data.queryString.email.trim()) ? data.queryString.email.trim() : false;
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;
  console.log(token);

  if (email) {
    if (token) {
      // Verify the token
      handler._tokens.verifyToken(token, email, function (isValid) {
        if (isValid) {
          // Read the menu item list
          _data.getList('menu', function (err, list) {
            if (!err && list) {
              callback(200, list);
            } else {
              callback(500, {
                Error: 'Could not read the menu item list'
              });
            }
          });
        } else {
          callback(403, {
            Error: 'The token is invalid or has expired.'
          });
        }
      });
    } else {
      callback(403, {
        Error: 'Unauthorized user'
      });
    }
  } else {
    callback(400, {
      Error: 'Missing required parameter'
    })
  }
}

// Handles all the cart operations
handler.cart = function (data, callback) {
  var methods = ['get', 'post', 'put', 'delete'];

  if (methods.indexOf(data.method) > -1) {
    handler._cart[data.method](data, callback);
  } else {
    callback(405);
  }
}

handler._cart = {};

// Cart - POST
// Required input: email, item_name, quantity
// Optional input: none
handler._cart.post = function (data, callback) {
  // Verify the input
  var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 && helper.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;
  var itemName = typeof (data.payload.itemName) === 'string' && data.payload.itemName.trim().length > 0 ? data.payload.itemName.trim() : false;
  var quantity = parseInt(data.payload.quantity) !== 'NaN' &&
    data.payload.quantity > 0 ? data.payload.quantity : false;
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;
  console.log(token);

  if (email && itemName && quantity) {
    if (token) {
      // Verify the token
      handler._tokens.verifyToken(token, email, function (isValid) {
        if (isValid) {
          // Read the user data
          _data.read('users', email, function (err, userData) {
            if (!err && userData) {
              // Check if the item is present in the menu or not
              _data.read('menu', itemName, function (err, itemData) {
                if (!err && itemData) {
                  userData.cart = typeof (userData.cart) === 'object' && userData.cart instanceof Object ? userData.cart : {};

                  if (userData.cart[itemName] === undefined) {
                    // Insert the item into the cart
                    userData.cart[itemName] = {};
                    userData.cart[itemName]['quantity'] = quantity;
                    userData.cart[itemName]['total'] = quantity * itemData.price;

                    // Save the updated data
                    _data.update('users', email, userData, function (err) {
                      if (!err) {
                        callback(200);
                      } else {
                        callback(500, {
                          Error: 'Could not update the user data'
                        });
                      }
                    });
                  } else {
                    callback(400, {
                      Error: 'The item is already in your cart. You can update your cart.'
                    })
                  }
                } else {
                  callback(404, {
                    Error: 'The item does not exist in the menu'
                  });
                }
              });
            } else {
              callback(500, {
                Error: 'Could not read the user data'
              });
            }
          });
        } else {
          callback(403, {
            Error: 'The token is invalid or has expired'
          })
        }
      });
    } else {
      callback(403, {
        Error: 'Unauthorized user'
      });
    }
  } else {
    callback(400, {
      Error: 'Invalid or missing required parameters'
    });
  }
}

// Cart - GET
// Required input: email
// Optional input: none
handler._cart.get = function (data, callback) {
  // Verify the input
  var email = typeof (data.queryString.email) === 'string' && data.queryString.email.trim().length > 0 && helper.validateEmail(data.queryString.email.trim()) ? data.queryString.email.trim() : false;
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;
  console.log(token);

  if (email) {
    // Verify the token
    handler._tokens.verifyToken(token, email, function (isValid) {
      if (isValid) {
        // Read the data
        _data.read('users', email, function (err, userData) {
          if (!err && userData) {
            callback(200, userData.cart);
          } else {
            callback(500, {
              Error: 'Could not read the cart data'
            })
          }
        });
      } else {
        callback(403, {
          Error: 'The token is invalid or has expired'
        });
      }
    });
  } else {
    callback(400, {
      Error: 'Missing required parameter'
    })
  }
}

// Cart - PUT
// Required input: email, itemName, quantity
// Optional input: none
handler._cart.put = function (data, callback) {
  // Verify the input
  var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 && helper.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;
  var itemName = typeof (data.payload.itemName) === 'string' && data.payload.itemName.trim().length > 0 ? data.payload.itemName.trim() : false;
  var quantity = parseInt(data.payload.quantity) !== 'NaN' &&
    data.payload.quantity > 0 ? data.payload.quantity : false;
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;

  if (email && itemName && quantity) {
    // Verify the token
    handler._tokens.verifyToken(token, email, function (isValid) {
      if (isValid) {
        // Read the user cart
        _data.read('users', email, function (err, userData) {
          if (!err && userData) {
            userData.cart = typeof (userData.cart) === 'object' && userData.cart instanceof Object ? userData.cart : {};

            if (userData.cart[itemName] !== undefined) {
              // Read the item details
              _data.read('menu', itemName, function (err, itemData) {
                if (!err && userData) {
                  userData.cart[itemName].quantity = quantity;
                  userData.cart[itemName].total = quantity * itemData.price;

                  // Update the cart data
                  _data.update('users', email, userData, function (err) {
                    if (!err) {
                      callback(200);
                    } else {
                      calllback(500, {
                        Error: 'Could not read the cart data'
                      })
                    }
                  })
                } else {
                  callback(400, {
                    Error: 'Item does not exist in the menu'
                  });
                }
              });
            } else {
              callback(400, {
                Error: 'The item does not exist in users cart. Please add the item to the cart if you want to order'
              });
            }
          } else {
            callback(400, {
              Error: 'Could not read user cart data'
            });
          }
        });
      } else {
        callback(403, {
          Error: 'The token is invalid or has expired.'
        })
      }
    });
  } else {
    callback(400, {
      Error: 'Missing required parameter'
    })
  }
}

// Cart - DLETE
// Required input: email, itemName
// Optional input: none
handler._cart.delete = function (data, callback) {
  // Verify the input
  var email = typeof (data.queryString.email) === 'string' && data.queryString.email.trim().length > 0 && helper.validateEmail(data.queryString.email.trim()) ? data.queryString.email.trim() : false;
  var itemName = typeof (data.queryString.itemName) === 'string' && data.queryString.itemName.trim().length > 0 ? data.queryString.itemName.trim() : false;
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;

  if (email && itemName && token) {
    // Verify the token
    handler._tokens.verifyToken(token, email, function (isValid) {
      if (isValid) {
        // Read the user data
        _data.read('users', email, function (err, userData) {
          if (!err && userData) {
            userData.cart = typeof (userData.cart) === 'object' && userData.cart instanceof Object ? userData.cart : {};

            if (userData.cart[itemName] !== undefined) {
              delete userData.cart[itemName];

              // Update the cart
              _data.update('users', email, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, {
                    Error: 'Could not delete the item from the cart'
                  })
                }
              });
            } else {
              callback(400, {
                Error: 'The item does not exist in your cart'
              })
            }
          } else {
            callback(400, {
              Error: 'Could not read user cart data'
            });
          }
        });
      } else {
        callback(403, {
          Error: 'The token is invalid or has expired'
        });
      }
    });
  } else {
    callback(400, {
      Error: 'Missing required parameter'
    })
  }
}

// Handle payment related operation
handler.pay = function (data, callback) {
  var methods = ['post'];

  if (methods.indexOf(data.method) > -1) {
    handler._pay[data.method](data, callback);
  } else {
    callback(405);
  }
}


handler._pay = {};

// Pay - POST
// Required input: email, token
// Optional input: none
handler._pay.post = function (data, callback) {
  // Verify the input
  var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 && helper.validateEmail(data.payload.email.trim()) ? data.payload.email.trim() : false;
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;

  if (email) {
    if (token) {
      // Verify the token
      handler._tokens.verifyToken(token, email, function (isValid) {
        if (isValid) {
          // Get the cart details
          _data.read('users', email, function (err, userData) {
            if (!err && userData) {
              userData.cart = typeof (userData.cart) === 'object' && userData.cart instanceof Object ? userData.cart : {};

              if (Object.keys(userData.cart).length > 0) {
                var totalAmount = 0;

                // Get the total amount
                Object.keys(userData.cart).forEach((item) => {
                  totalAmount += userData.cart[item].total;
                })

                // Default token for payment (Only for testing)
                var token = "tok_visa";

                // Form order object
                var id = helper.generateRandomId(20);
                var orderObject = {};
                orderObject.id = id;
                orderObject.name = userData.name;
                orderObject.email = email;
                orderObject.item = userData.cart;
                orderObject.address = userData.address;
                orderObject.orderTime = new Date();
                orderObject.deliverTime = new Date() + 1000 * 60 * 60;

                // Data for payment
                var postData = querystring.stringify({
                  amount: totalAmount,
                  currency: 'usd',
                  description: 'Pizza order',
                  source: token
                });

                // Options for payment
                const options = {
                  method: 'POST',
                  headers: {
                    'Authorization': 'Bearer ' + config.secretApiKey,
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
                };


                // Make payment request
                var req = http.request('https://api.stripe.com/v1/charges', options, (res) => {
                  if (res.statusCode === 200) {
                    // Store the order
                    _data.create('order', id, orderObject, function (err) {
                      if (!err) {
                        // Store the order details
                        userData.orders = typeof (userData.orders) === 'object' && userData.orders instanceof Array ? userData.orders : [];

                        // Clear the cart data
                        userData.cart = {};

                        // Store the order ID
                        userData.orders.push(id);

                        // Update the user data
                        _data.update('users', email, userData, function (err) {
                          if (!err) {
                            // Data for sending mail
                            var postData = querystring.stringify({
                              from: config.mailSource,
                              to: userData.name + ' <' + userData.email + '>',
                              subject: 'Pizza order',
                              html: helper.generateMailStructure(orderObject)
                            });

                            // Options for mail
                            const options = {
                              method: 'POST',
                              headers: {
                                'Authorization': 'Basic ' + Buffer.from(config.mailgunUser + ':' + config.mailgunApiKey).toString('base64'),
                                'Content-Type': 'application/x-www-form-urlencoded'
                              }
                            };

                            // Send the mail
                            var req = http.request("https://api.mailgun.net/v3/sandbox859670e489f74e278b0d6d57cc96a415.mailgun.org/messages", options, (res) => {
                              var result = '';
                              res.on('data', function (chunk) {
                                result += chunk;
                              });
                              res.on('end', function () {
                                console.log(result);
                              });
                              res.on('error', function (err) {
                                console.log(err);
                              })
                            });

                            // Pass the mail data
                            req.write(postData);
                            req.end();

                            callback(200, orderObject);
                          } else {
                            callback(500, {
                              Error: 'Could not store the order details'
                            })
                          }
                        });
                      } else {
                        callback(400, {
                          Error: 'Could not place the order'
                        })
                      }
                    });
                  } else {

                  }

                });

                // Pass the payment data
                req.write(postData);
                req.end();
              } else {
                callback(400, {
                  Error: 'Your cart is empty'
                });
              }
            } else {
              callback(400, {
                Error: 'Could not read user data'
              })
            }
          })
        } else {
          callback(403, {
            Error: 'The token is invalid or has expired'
          })
        }
      });
    } else {
      callback(403, {
        Error: 'Token is required'
      });
    }
  } else {
    callback(400, {
      Error: 'Missing required parameter'
    });
  }
}

// Handle all the order related operations
handler.order = function (data, callback) {
  var methods = ['get'];

  if (methods.indexOf(data.method) > -1) {
    handler._order[data.method](data, callback);
  } else {
    callback(405)
  }
};

handler._order = {};

// Order - GET
// Required input: email, orderId
// Optional input: none
handler._order.get = function (data, callback) {
  // Validate the input
  var email = typeof (data.queryString.email) === 'string' && data.queryString.email.trim().length > 0 && helper.validateEmail(data.queryString.email.trim()) ? data.queryString.email.trim() : false;
  var orderId = typeof (data.queryString.orderId) === 'string' && data.queryString.orderId.trim().length === 20 ? data.queryString.orderId.trim() : false;
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;

  if (email && orderId) {
    if (token) {
      // Validate the token
      handler._tokens.verifyToken(token, email, function (isValid) {
        if (isValid) {
          // Read the user data
          _data.read('users', email, function (err, userData) {
            if (!err && userData) {
              // Store the order details
              userData.orders = typeof (userData.orders) === 'object' && userData.orders instanceof Array ? userData.orders : [];

              if (userData.orders.indexOf(orderId) > -1) {
                // If the order Id is valid then read the order detail
                _data.read('order', orderId, function (err, orderData) {
                  if (!err && orderData) {
                    callback(200, orderData);
                  } else {
                    callback(400, {
                      Error: 'The order is not present'
                    });
                  }
                });
              } else {
                callback(400, {
                  Error: 'The order ID is invalid'
                });
              }
            } else {
              callback(400, {
                Error: 'Could not read user data'
              });
            }
          });
        } else {
          callback(403, {
            Error: 'The token is invalid or has expired'
          });
        }
      });
    } else {
      callback(403, {
        Error: 'Token is required'
      });
    }
  } else {
    callback(400, {
      Error: 'Missing required parameter'
    })
  }

};

// Get the order list
handler.orderList = function (data, callback) {
  var methods = ['get'];

  if (methods.indexOf(data.method) > -1) {
    handler._orderList[data.method](data, callback);
  } else {
    callback(405)
  }
};

handler._orderList = {};

// OrderList - GET
// Required input: email
// Optional input: none
handler._orderList.get = function (data, callback) {
  // Validate the input
  var email = typeof (data.queryString.email) === 'string' && data.queryString.email.trim().length > 0 && helper.validateEmail(data.queryString.email.trim()) ? data.queryString.email.trim() : false;
  var token = typeof (data.header.token) === 'string' && data.header.token.trim().length === 20 ? data.header.token.trim() : false;

  if (email) {
    if (token) {
      // Verify the token
      handler._tokens.verifyToken(token, email, function (isValid) {
        if (isValid) {
          // Read the user data
          _data.read('users', email, function (err, userData) {
            if (!err && userData) {
              // Store the order details
              userData.orders = typeof (userData.orders) === 'object' && userData.orders instanceof Array ? userData.orders : [];

              var orderArray = [];
              userData.orders.forEach((orderId) => {
                // Read the order
                _data.read('order', orderId, function (err, orderData) {
                  if (!err && orderData) {
                    orderArray.push(orderData);
                    // Check if all the order data is read
                    if (orderArray.length === userData.orders.length) {
                      callback(200, orderArray);
                    }
                  } else {
                    callback(400, {
                      Error: 'Error while reading order details'
                    });
                  }
                });
              });
            } else {
              callback(400, {
                Error: 'Could not read user data'
              });
            }
          });
        } else {
          callback(403, {
            Error: 'The token is invalid or has expired'
          });
        }
      });
    } else {
      callback(403, {
        Error: 'Token is required'
      });
    }
  } else {
    callback(400, {
      Error: 'Missing required parameter'
    });
  }
};

module.exports = handler;