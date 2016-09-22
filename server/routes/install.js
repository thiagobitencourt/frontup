var express = require('express');

var router;
var AWS;
var InstallRoute = function(router) {
  this.router = router;
  AWS = require(__base + 'controllers/aws');
  setInstallRoutes();
  setProgressRoutes();
}

var setInstallRoutes = function() {
  var _route = '/install';
  var _routeId = _route + '/:project/:version';

  this.router.get(_routeId, function(req, res) {
    AWS.getObject(req.params.project, req.params.version, function() {
      res.send("Done...!");
    });
    /*
    Ideia:
      - How about implement a state machine to handle the install process?
      - The process are:
        -> download
        -> Deploy
        -> Extract
        -> Remove .tar.gz file (or keep it, but the state is the same - finished);
    */
  });
}

var setProgressRoutes = function() {
  var _route = '/progress';
  var _routeId = _route + '/:id';

  this.router.get(_routeId, function(req, res) {
    /*
      Idea:
        A proccess is the instalation of a new package (frontend project) and it has its information, like:
          - the process state/status
          - information about the object (or project) been installed
          - options and/or current configurations for the instalation and deploy
    */
    var response = {
      progress: {
        id: req.params.id,
        status: {
          code: 1, /* [{code: 0, description: 'stopped'}, {code: 1, description: 'downloading'}, {code: 2, description: 'installing'}, {code: 3, description: 'done'}, {code: 4, description: 'error'}] */
          description: 'downloading',
          error: null /* {message: "Error on download, you don't have access at this repo"}*/
        },
        percentage: 70, /* 70% */
        startTime: new Date(),
        endTime: null,
        done: false /* see status to details. If true the status.code is 3*/
      },
      info: {
        project: {
          name: 'Projeto1',
          description: 'desc1'
        },
        version: {
          versions: '1',
          name: 'version1'
        },
        options: {
          install: true,
          keep: true, /* default is false */
          path: 'tmp/here/', /* only if keep is true */
          config: {code: 1 /* Config on the installing process goes here */ }
        }
      },
      user: {
        name: 'Thiago'
        /* User info here */
      }
    };
    return res.send(response);
  });

  /* Return a list of process of projects been installed or all of them */
  this.router.get(_route, function(req, res) {
    /*if(req.query.onlyOpen === 'true') return onle the process that has status not equal to done */
    res.send({list: ["object1", "object2"]});
  });
}

module.exports = InstallRoute;
