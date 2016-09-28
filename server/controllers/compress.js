'use strict';
var CompressController = function() {
  var targz = require('tar.gz');
  var fs = require('fs-extra');


  var services = {
    decompress: decompress
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

      targz().extract(source, __media + 'tmp', function(err) {
        if(err) return callback(err);
        fs.copy(__media + 'tmp/dist/', dest, function() {
          /* remove tmp folder */
          callback(err);
        });
      });
    });
  };
};

module.exports = CompressController();
