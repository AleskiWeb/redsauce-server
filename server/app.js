var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var dbConfig   = require('./config/db')

// Set our port
var port = process.env.PORT || 8080;

// MongoDB connection URI
var mongoUri = dbConfig.uri;

// ROUTES
var routes = require('./routes');

/**
 * MONGO Connect
 */
mongoose.connect(mongoUri, function(err) {
  if (err) {
    throw err;
  }

  console.log('MongoDB connection established');
});

// Configure app to use bodyParser() to get post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Argv check to see if dbSeed has been passed through
if (process.argv.indexOf('dbSeed') > -1) {
  // Seed DB code in here
}

/**
 * Establish Routes for the App
 */
routes(app); 

/**
 * Start the Application
 */
app.listen(port);
console.log('Node application started. Running on ' + port);
