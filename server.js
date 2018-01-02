var express = require("express");
var bodyParser = require("body-parser");
var _ = require('lodash');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var POEM_COLLECTION = "gushi";

var app = express();
var path = require('path');
app.use(bodyParser.json());

// Create link to html directory
app.use('/', express.static(path.join(__dirname, 'public')))

var poems = [];

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/api/poems", function(req, res) {
  res.status(200).json(poems);
});

app.post("/api/poems", function(req, res) {
  var newPoem = req.body;
  poems = _.concat(poems, newPoem);
  res.status(201).json(newPoem);
});

app.get("/api/poems/:id", function(req, res) {
  var poemIndex = _.findIndex(poems, function(p) {
    return p.text === req.params.id;
  })
  res.status(200).json((poemIndex > -1  ? 'Found' : 'Not Found'));
  console.log(req.params.id)
});
