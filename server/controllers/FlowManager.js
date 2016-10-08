'use strict';
var $q = require('q');
var Process = require(__base + 'controllers/Process');

var FlowManager = function() {
  var _process;

  this.Start = _start,
  this.Fetch = _fetch,
  this.Extract = _extract,
  this.Install = _install,
  this.Clean = _clean,
  this.Done = _done,
  this.Error = _error

  function _start(proc) {
    var deferred = $q.defer();
    _process = proc;
    _process.status(Process.STATUS.START);
    deferred.resolve(_process);
    return deferred.promise;
  }

  /*
    expected options object
    object {
      bucket: '',
      object: '',
      destination: ''
    }
  */
  function _fetch(proc) {
    var aws = require(__base + 'controllers/aws');
    var deferred = $q.defer();
    _process.status(Process.STATUS.DOWNLOAD);
    var object = proc.options().object;
    aws.getObject(object, function(err) {
      if(err) return _error(err, deferred);
      deferred.resolve(_process);
    });
    return deferred.promise;
  }

  /*
    Expect options object
    object: {
      destination: '',
    },
    install: {
      destination: ''
    }
  */
  function _extract(proc) {
    var compresser = require(__base + 'controllers/compress');
    var deferred = $q.defer();
    _process.status(Process.STATUS.INSTALL);

    console.log(_process.options());

    var source = _process.options().object.destination;
    var dest = _process.options().install.destination;
    console.log('Process: ' + _process.id() + ' - Extracting ' + proc.options().object.destination);
    compresser.decompress(source, dest, function(err) {
      if(err) return _error(err, deferred);
      console.log('Process: ' + _process.id() + ' - Extracted to ' + proc.options().install.destination);
      deferred.resolve(_process);
    });
    deferred.resolve(_process);
    return deferred.promise;
  }

  /**
    Expect options object

  */
  function _install(proc) {
    var deferred = $q.defer();
    deferred.resolve(_process);
    return deferred.promise;
  }

  function _clean(proc) {
    var deferred = $q.defer();

    deferred.resolve(_process);
    return deferred.promise;
  }

  function _done(proc) {
    console.log('Process: ' + _process.id() + ' - Done!');
    var deferred = $q.defer();
    _process.status(Process.STATUS.DONE);
    deferred.resolve(_process);
    return deferred.promise;
  }

  function _error(error, deferred) {
    console.error('Process: ' + _process.id() + ' - ERROR => ');
    console.error(error);
    _process.status(Process.STATUS.ERROR, error.message)
    return deferred.resolve(_process);
  }
}

module.exports = new FlowManager();
