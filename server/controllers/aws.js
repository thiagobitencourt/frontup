'use strict';
var AWSController = function() {
  var AWS = require('aws-sdk');
  AWS.config.loadFromPath(__base + 'config/aws.config.json');

  var s3 = new AWS.S3({apiVersion: '2006-03-01'});
  var services = {
    listBuckets: (callback) => { s3.listBuckets(callback) },
    listObjects: (bucket, cb) => { s3.listObjectsV2({Bucket: bucket}, cb) },
    getObject: getObject
  };
  return services;

  function getObject(bucket, object, callback) {
    var fs = require('fs-extra');
    //Get the object and save in a file
    var params = {Bucket: bucket, Key: object};

    fs.createFileSync(__media + params.Bucket + '/' + params.Key);
    var file = fs.createWriteStream(__media + params.Bucket + '/' + params.Key);

    // s3.getObject(params, function(err, data) {
    //   if (err) return callback(err.stack); // an error occurred
    //   console.log(data);
    //   fs.writeFile(__media + params.Bucket + '/' + params.Key, data.body, callback);
    // });

    s3.getObject(params)
      .on('httpData', function(chunk) {
        /* update state machine here to increment percentage of download stage*/
        file.write(chunk);
      })
      .on('httpDone', function() {
        file.end();
        /* update state machine here */
        console.log('done');
        callback();
      })
    .send();
  };
}();

module.exports = AWSController;
