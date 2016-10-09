'use strict';
var fs = require('fs');

var Config = function() {
  function _getAwsConfig() {
    var stopNow = (err) => { throw err };
    var _file = __base + 'config/aws.json';
    var _config = {};

    try {
      _config = JSON.parse(fs.readFileSync(_file, 'utf-8'));
      console.log('Found a config file');
    } catch(err) {
      if (err.code === "ENOENT") {
        // Get enviroment values
        console.log('No config file was given. Trying to use enviroment variables');
        _config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        _config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        _config.region = process.env.AWS_REGION || "us-west-2";
      } else return stopNow(err);
    }
    if(!_config.accessKeyId || !_config.secretAccessKey)
      return stopNow('Missing credentials');
    return _config;
  }

  return {
    aws: _getAwsConfig()
  }
}

module.exports = Config();
