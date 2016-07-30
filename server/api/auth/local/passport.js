var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var valMsg  = require('./../../validation.messages');

exports.setup = function (User) {
  passport.use(
    new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {

      // Allow the value from the field to be either email or username
      User.findOne({
        $or: [
          { email: username.toLowerCase() },
          { usernameLowerCase: username.toLowerCase() }
        ]
      }, function(err, user) {

        if (err || !user) {
          return done(err);
        }

        if (!user.comparePassword(password, function (err, isMatch) {
          if (err) {
            return done(err);
          }

          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: valMsg.error.mismatchCred });
          }
        }));
      });
    }
  ));
};