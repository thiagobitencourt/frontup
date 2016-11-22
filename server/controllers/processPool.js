'use strict';
var Process = require(__base + 'controllers/Process');

//ES6 code:
// var {Start, Fetch, Extract, Install, Clean, Done} = Flow;

var InitProcess = function(proc) {
  var Flow = require(__base + 'controllers/FlowManager');

  console.log('Process: ' + proc.id() + ' - Starting');
  Flow.Start(proc)
    .then(Flow.Fetch)
    .then(Flow.Extract)
    // .then(Flow.Install)
    .then(Flow.Clean)
    .then(Flow.Done)
    .catch(Flow.Error)
}

var ProcessPool = function(){
    var processPool = {};

    this.getStatus = function(proc) {
      console.log(proc);
      if(!isNaN(proc)) {
        var pr = processPool[proc];
        return pr ? pr.status() : Process.STATUS.NOTFOUND;
      }
      else if (proc.id) {
        var pr = processPool[proc.id];
        return pr ? pr.status() : Process.STATUS.NOTFOUND;
      }
      else
       return Process.STATUS.NOTFOUND; // process not found
    }

    this.getProcess = (id) => {
      return processPool[id];
    }

    this.newProcess = (options) => {
      var proc = new Process(options);
      processPool[proc.id()] = proc;
      InitProcess(proc);
      // Initiate the process here...
      return proc;
    }

    this.getProcessInfo = (id) => {
      var sintInfo = (proc) => {
        return {
            id: proc.id(),
            status: proc.status(),
            options: proc.options()
          };
      }
      if(id) {
        var proc = this.getProcess(id);
        return proc ? sintInfo(proc) : {status: Process.STATUS.NOTFOUND};
      } else {
        var procs = [];
        for(var pr in processPool) {
          procs.push(sintInfo(this.getProcess(pr)));
        }
        return procs;
      }
    }
}

ProcessPool.instance = null;
ProcessPool.getInstance = function(){
  if(this.instance === null){
      this.instance = new ProcessPool();
  }
  return this.instance;
}

module.exports = ProcessPool.getInstance();
