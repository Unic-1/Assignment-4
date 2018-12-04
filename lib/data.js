/**
 * Performs all the file related operations 
 * 
 */

// Dependencies
var fs = require('fs');
var path = require('path');
var helper = require('./helper');

var lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

// Create a new file and write data to the file
lib.create = function (dir, filename, data, callback) {
    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'wx', function (err, fileDescriptior) {
        if (!err && fileDescriptior) {
            // Convert data to string
            var strData = helper.parseObjectToString(data);

            // Write to the file
            fs.writeFile(fileDescriptior, strData, function (err) {
                if (!err) {
                    // Close the file
                    fs.close(fileDescriptior, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing the new file');
                        }
                    })
                } else {
                    callback('Could not write to the file.');
                }
            });
        } else {
            console.log(err);
            callback('Could not create new file. It may alerady exist.');
        }
    });
};


// Read the existing file
lib.read = function (dir, fileName, callback) {
    fs.readFile(lib.baseDir + dir + '/' + fileName + '.json', 'utf8', function (err, data) {
        if (!err) {
            var parsedData = helper.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });
};

// Update the details
lib.update = function (dir, fileName,  data, callback) {
    fs.open(helper.createFilePath(lib.baseDir, dir, fileName), 'r+', function(err, fileDescriptior) {
        if(!err && fileDescriptior) {
            // Convert data to  string
            var strData = helper.parseObjectToString(data);

            // Update the file
            fs.ftruncate(fileDescriptior, function(err) {
                if(!err) {
                    // Write the data to the file
                    fs.writeFile(fileDescriptior, strData, function(err) {
                        if(!err) {
                            // Close the file
                            fs.close(fileDescriptior, function(err) {
                                if(!err) {
                                    callback(false);
                                } else  {
                                    callback('Error while closing the file');
                                }
                            });
                        } else {
                            callback('Error writing to the existing file');
                        }
                    });
                } else {
                    callback('Error truncating file');
                }
            });
        } else {
            callback('Could not open the file for updaing. It might not exist yet.');
        }
    });
};

// Delete the data
lib.delete = function(dir, fileName, callback) {
    // Unlink the file
    fs.unlink(helper.createFilePath(lib.baseDir, dir, fileName), function(err) {
        if(!err) {
            callback(false);
        } else {
            callback('Error while deleting the file');
        }
    });
};

module.exports = lib;