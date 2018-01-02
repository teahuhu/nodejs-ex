var express = require("express");
var bodyParser = require("body-parser");
var _ = require('lodash');
var fs = require('fs');

var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var POEM_COLLECTION = "gushi";
var POEM_FILE = "./poems.html";

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
  //res.status(200).json(poems);
  fs.readFile(POEM_FILE, 'utf8', function(err, contents) {
    if (err) {
      console.log('CODE: ' + err.code);
      console.log('ERROR: ' + err);
      res.status(500).json('Error: ' + err);
      return;
    }       
    var allPoems = JSON.parse(contents);
    res.status(200).json(allPoems);
  });
});

app.post("/api/poems", function(req, res) {
  var newPoem = req.body;
  //poems = _.concat(poems, newPoem);
  //res.status(201).json(newPoem);
  fs.readFile(POEM_FILE, 'utf8', function(err, contents) {
    if (err && err.code !== 'ENOENT') {
      console.log('ERROR: ' + err);
      res.status(500).json('Error: ' + err);
      return;
    }    
    var allPoems = contents && contents !== undefined ? JSON.parse(contents) : [];
    allPoems = _.concat(allPoems, newPoem);
    fs.writeFile(POEM_FILE, JSON.stringify(allPoems), 'utf8', function(err) {
      if (err) { 
        console.log('ERROR: ' + err);
        res.status(500).json('Error: ' + err);
        return;
      }
      res.status(201).json(newPoem);
    });
  });
});

app.get("/api/poems/:id", function(req, res) {
  fs.readFile(POEM_FILE, 'utf8', function(err, contents) {
    if (err) {
      console.log('ERROR: ' + err);
      res.status(200).json('Not Found-Error: ' + err);
      return;
    }
    var allPoems = JSON.parse(contents);
    var poemIndex = _.findIndex(allPoems, function(p) {
      return p.text === req.params.id;
    })
    res.status(200).json((poemIndex > -1  ? 'Found' : 'Not Found'));
  });  

});
