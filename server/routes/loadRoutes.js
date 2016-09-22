var express = require('express');

var ProjectRoute = require(__base + 'routes/project');
var InstallRoute = require(__base + 'routes/install');

var LoadRoutes = function(){

	router = express.Router();

	new ProjectRoute(router);
	new InstallRoute(router);
	return router;
}

module.exports = LoadRoutes;
