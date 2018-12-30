/**
 * CLI Related task
 *
 */

// Dependencies
var readline = require('readline');
var events = require('events');
class _events extends events{};
var e = new _events();
var _data = require('./data');
var helpers = require('./helper');

// Instiantiate CLI object
var cli = {};

e.on('exit', function(str) {
    cli.responders.exit();
});

e.on('man', function(str) {
    cli.responders.help();
});

e.on('help', function(str) {
    cli.responders.help();
});

e.on('list users', function(str) {
    cli.responders.listUsers();
});

e.on('more user info', function(str) {
    cli.responders.moreUserInfo(str);
});

e.on('show menu', function(str) {
    cli.responders.showMenu();
})

e.on('list order', function(str) {
    cli.responders.listOrder(str);
});

e.on('more order info', function(str) {
    cli.responders.moreOrderInfo(str);
})


// Responder object
cli.responders = {};

// Exit
cli.responders.exit = function() {
    process.exit(0);
}

// Help / man
cli.responders.help = function() {
    var commands = {
        'exit': 'Kill the CLI (and the rest of the application)',
        'man': 'Show the help page',
        'help': 'Alias fo the "man" command',
        'show menu': 'Show the list of all the item you can order',
        'list users': 'Show the list of all the user in the system',
        'more user info --{userId}': 'Show details of a specific user',
        'list order --{userId}': 'Show a list of all the orders made by a user.',
        'more order info --{orderId}': 'Show the details of an order'
    };

    // Show a header for the help page that is as wide as the screen
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command, followed by its explanation in white and yellow respectively
    for(var key in commands) {
        var value = commands[key];
        var line = '\x1b[33m'+key+'\x1b[0m';
        var padding = 60 - line.length;
        for(var i=0; i<padding; i++) {
            line += ' ';
        }
        line += value;
        console.log(line);
        cli.verticalSpace();
    }

    cli.verticalSpace();
    cli.horizontalLine();
}

// Create a vertical space
cli.verticalSpace = function(lines) {
    lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
    for(var i = 0; i<lines; i++) {
        console.log('');
    }
};

// Create a horizontal line accross the screen
cli.horizontalLine = function() {
    // Get the available screen size
    var width = process.stdout.columns;

    var line = '';
    for(var i = 0; i<width; i++) {
        line += '-';
    }
    console.log(line);
}

// Create centered text on the screen
cli.centered = function(text) {
    text = typeof(text) == 'string' && text.trim().length > 0 ? text.trim() : '';

    // Get the available screen size
    var width = process.stdout.columns;

    // Calculate the left padding there should be
    var leftPadding = Math.floor(width - text.length) / 2;

    // Put in left padded spaces before the sting itself
    var line = '';
    for(var i = 0; i<leftPadding; i++) {
        line += ' ';
    }
    line += text;
    console.log(line);
}

// list user
cli.responders.listUsers = function() {
    _data.getList('users', function(err, userIds) {
        if(!err && userIds && userIds.length > 0) {
            userIds.forEach(function(userId) {
                console.log(userId);
                cli.verticalSpace();
            });
        }
    });
}

// more user info
cli.responders.moreUserInfo = function(str) {
    var arr = str.split('--');
    var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1] : false;

    if(userId) {
        _data.read('users', userId, function(err, userData) {
            if(!err && userData) {
                // Remove the password
                delete userData.hashedPassword;

                // Print the user data
                console.dir(userData, {colors: true});
            }
        });
    }
}

// show menu
cli.responders.showMenu = function() {
    _data.getList('menu', function(err, menuList) {
        if(!err && menuList && menuList.length > 0) {
            menuList.forEach(function(itemName) {
                _data.read('menu', itemName, function(err, itemData) {
                    if(!err && itemData) {
                        console.dir(itemData, {colors: true});
                        cli.verticalSpace();
                    }
                });
            });
        }
    });
}

// order
cli.responders.listOrder = function(str) {
    var arr = str.split('--');
    var userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1] : false;

    if(userId) {
        _data.read('users', userId, function(err, userData) {
            if(!err && userData) {
                userData.orders.forEach(function(orderId) {
                    console.log(orderId);
                    cli.verticalSpace();
                });
            }
        });
    }
}

// more order info
cli.responders.moreOrderInfo = function(str) {
    var arr = str.split('--');
    var orderId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1] : false;

    _data.read('order', orderId, function(err, orderData) {
        if(!err && orderData) {
            // Print the order details
            console.dir(orderData, {colors: true});
            cli.verticalSpace();
        }
    });
}

// Process the input
cli.processInput = function(str) {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;

    // Only process the input if the user actually wrote something. Otherwise ignore
    if(str) {
        // Codify the unique  strings that identify the unique questions allowed to be asked
        var uniqueInputs = [
            'man',
            'help',
            'exit',
            'show menu',
            'list users',
            'more user info',
            'list order',
            'more order info'
        ];

        // Go through the possible inputs, emit an event when a match is found
        var matchFound = false;
        var conter = 0;
        uniqueInputs.some(function(input) {
            if(str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // Emit an event matching the unique input, and include the full string given by the user
                e.emit(input, str);
                return true;
            }
        });

        // If no match is found, tell the user to try again
        if(!matchFound) {
            console.log('Sorry, try again');
        }
    }
}

// Initalize cli
cli.init = function() {
    console.log('\x1b[34m%s\x1b[0m', 'The CLI is running')

    // Start the interface
    var _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    });

    // Create an initial prompt
    _interface.prompt();

    // Handle each line of input seperately
    _interface.on('line', function(str) {
        // Send to the input processor
        cli.processInput(str);

        // Re-initialize the prompt afterwards
        setTimeout(function() {
            _interface.prompt();
        }, 50);
    });

    // If the user stops the CLI, kill the associated process
    _interface.on('close', function() {
        process.exit(0);
    });
}

// Export cli object
module.exports = cli;

