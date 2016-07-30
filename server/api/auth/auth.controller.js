var mongoose    = require('mongoose');
var passport    = require('passport');
var jwt         = require('jsonwebtoken');
var expressJwt  = require('express-jwt');
var compose     = require('composable-middleware');
var User        = require('../users/user.model');
var config      = require('../../config')
var valMsg      = require('./../validation.messages');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()

    // Validate jwt
    .use(function(req, res, next) {

      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }

      validateJwt(req, res, next);
    })

    // Attach user to request
    .use(function(req, res, next) {
      var errMsg = valMsg.error.noAuth;
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(403).send(errMsg);

        req.user = user;
        next();
      });
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  var errMsg = valMsg.error.noPerm;
  if (!roleRequired) throw new Error(errMsg);

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      } else {
        res.status(403).send(errMsg);
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id, role, username) {
  return jwt.sign({ _id: id, role: role, username: username }, config.secrets.session, { expiresIn: 60*60*5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  var errMsg = valMsg.error.notFound.replace('{PATH}', 'user');
  if (!req.user) return res.status(404).send(errMsg);
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
