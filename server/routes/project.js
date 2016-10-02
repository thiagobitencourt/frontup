'use strict';
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

      var sendErr = (e) => {res.status(400).send(e)};
      var byteToMb = (b) => { return ((b / 1024) / 1024)};
      var projects = [];
      var group = {};
      if(data.Contents) {
        data.Contents.forEach((e) => {
          var entries = e.Key.split('/');
          if(entries.length > 2 && e.Size > 0) {

            var version = {
              name: entries[2],
              version: entries[1],
              size: byteToMb(e.Size).toFixed(3) + ' MB',
              lastModified: e.LastModified,
              object: e.Key
            };

            var pr = projects.find((p) => p.name === entries[0]);
            if(!pr) {
              pr = {name: entries[0], records: [version]};
              projects.push(pr);
            } else pr.records.push(version);
          }
        });

        res.send(projects);
      } else return sendErr("No content");

    });
  });
}

module.exports = ProjetRoute;
