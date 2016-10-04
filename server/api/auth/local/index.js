var express   = require('express');
var passport  = require('passport');
var valMsg    = require('../../validation.messages')
var auth      = require('../auth.controller');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) {
      console.log(error);
      return res.status(401).send({ message: valMsg.error.mismatchCred }); 
    }

    if (!user) return res.status(401).send({ message: valMsg.error.mismatchCred });

    var token = auth.signToken(user._id, user.role);
    res.json({token: token});
  })(req, res, next);
});

module.exports = router;