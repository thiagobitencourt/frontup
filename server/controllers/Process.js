'use strict';
/*
  The process class representation
*/
var __processId = 1;
var nextId = () => {return __processId++};

var Process = function(options) {

  /** Initial states */
  var _id = nextId();
  var _done = false;
  var _error = false;
  var _stopped = true;
  var _processStatus = Process.STATUS.STOPPED;
  var _errorMessage = undefined;
  var _options = options;

  this.status = status;
  this.id = () => { return _id };
  this.isDone = () => { return _done };
  this.hasError = () => { return _error };
  this.isStopped = () => { return _stopped };
  this.errorMessage = () => { return _errorMessage };
  this.options = () => { return _options };

  var setStopped = () => {
    _done = false,
    _error = false;
    _stopped = true;
    _options.endTime = new Date();
  };
  var setDone = () => {
    _done = true,
    _error = false;
    _stopped = false;
    _options.endTime = new Date();
  };
  var setStarted = () =>
  {
    _done = false,
    _error = false;
    _stopped = true;
    _options.startTime = new Date();
  }
  var setError = (message) =>
  {
    _done = false;
    _error = true;
    _stopped = false;
    _errorMessage = message;
    _options.endTime = new Date();
  };

  // Set the status or return the current status if no status parameter is available
  function status(status, message) {
    if(!status) {
      _processStatus.message = _errorMessage;
      return _processStatus;
    }

    if(_isValidStatus(status)) {
      _processStatus = status;
      switch (_processStatus.code) {
        case Process.STATUS.STOPPED.code:
          setStopped();
          break;
        case Process.STATUS.START.code:
          setStarted();
          break;
        case Process.STATUS.DONE.code:
          setDone();
          break;
        case Process.STATUS.ERROR.code:
          setError(message);
          break;
      }
    } else
      throw new Error('INVALID STATUS');
  };

  /**
    The status passed must be one of those in the STATUS ENUM, otherwise is not a valid status
  */
  function _isValidStatus(status) {
    var isValid = false;
    var Status = Process.STATUS;
    for(var st in Status) {
      var prSt = Status[st];
      if(prSt.code === status.code && prSt.description === status.description) {
        isValid = true;
        break;
      }
    }
    return isValid;
  };
};

/* The ENUM with the possibles status for a process */
Process.STATUS = {
  NOTFOUND: {code: -1, description: 'Not found'},
  STOPPED:  {code: 0, description: 'Stopped'},
  DONWLOAD: {code: 1, description: 'Downloading'},
  INSTALL:  {code: 2, description: 'Installing'},
  DONE:     {code: 3, description: 'Done'},
  START:    {code: 4, description: 'Started'},
  ERROR:    {code: 5, description: 'Error'}
}

module.exports = Process;
