var express     = require('express');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var bluebird    = require('bluebird');
var colors      = require('colors');
var dbConfig    = require('./config/db');
var app         = express();

// Set our port
var port = process.env.PORT || 8080;

// MongoDB connection URI
var mongoUri = dbConfig.uri;

// ROUTES
var routes = require('./routes');

/**
 * MONGO Connect
 * mongoose promise library override with bluebird
 */
mongoose.Promise = bluebird;
mongoose.connect(mongoUri, function(err) {
  if (err) {
    throw err;
  }

  console.log('MongoDB connection established');
});

// Configure app to use bodyParser() to get post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Establish Routes for the App
 */
routes(app); 

/**
 * Start the Application
 */
app.listen(port);
console.log('Node application started. Running on ' + port);
