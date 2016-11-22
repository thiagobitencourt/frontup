'use strict';
var CompressController = function() {
  var targz = require('tar.gz');
  var fs = require('fs-extra');


  var services = {
    decompress: decompress,
    remove: remove
  };
  return services;

  function decompress(source, dest, callback) {
    /*
      Idea:
        - Create a unique temporary directory, may be the process ID
        - Param with the destination directory
        - If keeps the same as the compressed file,
          wee can extect directly to the destination and skip the copy step.
        - If the tmp extracted folder has only one directory it enter this directory to copy, otherwise copy all.
    */
    fs.mkdirs(dest, function (err) {
      if (err) return callback(err);

      targz().extract(source, dest, callback);
    });
  };

  function remove(source, callback) {
    // mark to remove after a 30 sec
    setTimeout(function() {
      console.log('Removing file: ' + source);
      fs.remove(source, function(err){
        if (err) return callback(err);
        callback();
      });
    }, 1000 * 30);
  }
};

module.exports = CompressController();
