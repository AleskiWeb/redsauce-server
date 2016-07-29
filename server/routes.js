var users     = require('./api/users');
var auth      = require('./api/auth')

module.exports = function (app) {

  // REGISTER OUR ROUTES -------------------------------
  app.use('/api', function (req, res, next) {
    console.log('API call: Method: ' + req.method +  ', URL: ' + req.url);

    // Make sure we go to the next routes and don't stop here
    next();
  })

  app.use('/api/users', users);
  app.use('/api/auth', auth)
}