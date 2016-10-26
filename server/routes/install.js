var express = require('express');

var processPool = require(__base + 'controllers/processPool');

var router;
var AWS;
var Compress;
var InstallRoute = function(router) {
  this.router = router;
  AWS = require(__base + 'controllers/aws');
  Compress = require(__base + 'controllers/compress');
  setInstallRoutes();
  setProgressRoutes();
}

var setInstallRoutes = function() {
  var _route = '/install';

  this.router.get(_route, function(req, res) {

    var bucket = req.query.bucket;
    var object = req.query.object;
    var file = [__media, bucket, '/', object].join("");

    var installDestination = __base + '../install';
    var objectDest = __media + bucket;

    var options = {
      object: {
        bucket: bucket,
        object: object,
        destination: file
      },
      install: {
        destination: installDestination,
        keep: false
      }
    }

    var proc = processPool.newProcess(options);
    console.log('Started process ' + proc.id());
    // build the option object and pass on
    return res.status(200).send({process: proc.id(), options: proc.options()});
  });
}

var setProgressRoutes = function() {
  var _route = '/progress';
  var _routeId = _route + '/:id';

  this.router.get(_routeId, function(req, res) {
    console.log("Params id: " + req.params.id);
    var status = processPool.getStatus(req.params.id);
    return res.status(200).send({status: status});
  });

  /* Return a list of process of projects been installed or all of them */
  this.router.get(_route, function(req, res) {
    var Process = require(__base + 'controllers/Process');
    var procs = processPool.getProcessInfo();

    if(req.query.error && req.query.error === 'true')
      procs = procs.filter(pr => pr.status.code === Process.STATUS.ERROR.code);
    if(req.query.done && req.query.done === 'true')
      procs = procs.filter(pr => pr.status.code === Process.STATUS.DONE.code);

    return res.status(200).send(procs);
  });
}

module.exports = InstallRoute;
