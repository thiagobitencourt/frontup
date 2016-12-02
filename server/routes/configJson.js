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
    
    return;
    res.json({
      "menu": [
        {
          label: "Entrada 1",
          children: [
            {
              label: 'Sub-menu1',
              path: {
                type: 'iframe',
                menuId: 'path/to/frontend'
              },
              auth: {
                resource: 'resource for the menu entry',
                permission: 'permission'
              }
            }
          ]
        }, 
        {
          label: 'Entrada 2',
          path: {
            type: 'iframe',
            menuId: 'path/to/frontend'
          }
        }
      ]
    });
  });
};

module.exports = ConfigJsonRoute;
//
