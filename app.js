/*
  @Author: Thiago R. M. Bitencourt
  Node.js app entry
*/
'use strict';
global.__base = __dirname + '/server/';
global.__media = __base + 'restricted_media/';
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

// var Process = require(__base + 'controllers/Process');
// var pr = new Process({object: {bucket: 'esse'}, install: {dest: 'aqui'}});
// console.log(pr.id());
// console.log(pr.status());
//
// pr.status(Process.STATUS.DONE);
// console.log(pr.status());
//
// console.log(pr.options());
//
// return;

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));

//Necessary headers to clients access.
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/', express.static('public/src'));

var LoadRouter = require(__base + 'routes/loadRoutes');
app.use('/api/v1.0/', new LoadRouter());

var httpPort = 8080;
http.createServer(app).listen(httpPort, function(){
  console.log("HTTP server listening on port %s", httpPort);
});
