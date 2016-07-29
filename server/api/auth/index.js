var express       = require('express');
var passport      = require('passport');
var localRoute    = require('./local');
var passportLocal = require('./local/passport');
var User          = require('./../users/user.model');

var router = express.Router();

// Passport Configuration
passportLocal.setup(User);

// Route for authing a user
router.use('/local', localRoute);

module.exports = router;