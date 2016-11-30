var express = require('express');

var router;
var ConfigJsonRoute = function(router) {
  this.router = router;
  setConfigJsonRoutes();
}

var setConfigJsonRoutes = function() {
  var _route = '/config-json';

  this.router.get(_route, function(req, res) {

    res.json(
      {
        "config": {
          option: true,
          desce:
          [
            {outro: false, attrr: 'atributo'},
            {outro: true, attrr: 'qualquer coisa', opt: {a: 'a'}}
          ]
        },
        valor: 250,
        url: 'url_aqui'
    });
  });
};

module.exports = ConfigJsonRoute;
//
