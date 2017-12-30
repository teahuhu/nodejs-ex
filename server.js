var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var POEM_COLLECTION = "gushi";

var app = express();
var path = require('path');
app.use(bodyParser.json());

// Create link to html directory
app.use('/', express.static(path.join(__dirname, 'public')))

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/messages', function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/api/poems", function(req, res) {
  db.collection(POEM_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get poems.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/poems", function(req, res) {
  var newPoem = req.body;

  db.collection(POEM_COLLECTION).insertOne(newPoem, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new poem.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.get("/api/poems/:id", function(req, res) {
  console.log(req.params.id)
  db.collection(POEM_COLLECTION).findOne({text: req.params.id}, function(err, doc) {
    console.log(doc)
    if (err) {
      handleError(res, err.message, "Failed to get poem");
    } else {
      res.status(200).json((doc && doc !== undefined ? 'Found' : 'Not Found'));
    }
  });
});
