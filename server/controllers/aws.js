'use strict';
var AWSController = function() {
  var AWS = require('aws-sdk');
  // AWS.config.loadFromPath(__base + 'config/aws.config.json');
  AWS.config.update(__config.aws);

  /**
    // Proxy configuration
    var proxy = require('proxy-agent');

    AWS.config.update({
      httpOptions: { agent: proxy('http://internal.proxy.com') }
    });
  */

  var s3 = new AWS.S3({apiVersion: '2006-03-01'});
  var services = {
    listBuckets: (callback) => { s3.listBuckets(callback) },
    listObjects: (bucket, cb) => { s3.listObjectsV2({Bucket: bucket}, cb) },
    getObject: getObject
  };
  return services;

  function getObject(options, callback) {
    var fs = require('fs-extra');
    //Get the object and save in a file
    var params = {Bucket: options.bucket, Key: options.object};

    fs.createFileSync(options.destination);
    var file = fs.createWriteStream(options.destination);
    s3.getObject(params)
      .on('httpData', function(chunk) {
        /* update state machine here to increment percentage of download stage*/
        file.write(chunk);
      })
      .on('httpDone', function() {
        file.end();
        /* update state machine here */
        callback();
      })
    .send();
  };
}();

module.exports = AWSController;
