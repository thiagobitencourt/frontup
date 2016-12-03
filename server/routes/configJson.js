var express = require('express');

var router;
var ConfigJsonRoute = function(router) {
  this.router = router;
  setConfigJsonRoutes();
}

var setConfigJsonRoutes = function() {
  var _route = '/config-json';
  var fs = require('fs');

  this.router.get(_route, function(req, res) {

    var config = fs.readFileSync(__base + 'config/config.json', 'utf-8');
    res.json(JSON.parse(config));
  });

  this.router.post(_route, function(req, res) {
    console.log(req.body);
    fs.writeFile(__base + 'config/config.json', JSON.stringify(req.body, null, 2), function(err) {
      if(err) {
        console.log(err);
        return res.status(400).send({message: err});
      }
      return res.send({});
    })
  });
};

module.exports = ConfigJsonRoute;
//
