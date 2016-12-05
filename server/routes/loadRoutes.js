var express = require('express');

var ProjectRoute = require(__base + 'routes/project');
var InstallRoute = require(__base + 'routes/install');
var ConfigJsonRoute = require(__base + 'routes/configJson');

var LoadRoutes = function(){

	router = express.Router();

	new ProjectRoute(router);
	new InstallRoute(router);
	new ConfigJsonRoute(router);
	return router;
}

module.exports = LoadRoutes;
