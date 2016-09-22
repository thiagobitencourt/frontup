var express = require('express');

var router;
var AWS;

var ProjetRoute = function(rt) {
  router = rt;
  AWS = require(__base + 'controllers/aws');
  setProjectRoutes();
  setVersionRoutes();
}

var setProjectRoutes = function() {
  var _route = '/project';

  router.get(_route, function(req, res) {
    AWS.listBuckets(function(err, data) {
      if(err) return res.status(400).send(err);
      res.send(data);
    });
  });

}

var setVersionRoutes = function() {
  var _route = '/version';
  var _routeId = _route + '/:project';

  router.get(_routeId, function(req, res) {
    AWS.listObjects(req.params.project, function(err, data){
      if(err) return res.status(400).send(err);
      res.send(data);
    });
  });
}

module.exports = ProjetRoute;
