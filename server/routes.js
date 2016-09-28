var users        = require('./api/users');
var auth         = require('./api/auth');
var blog         = require('./api/blog');
var achievements = require('./api/achievements');

module.exports = function (app) {

  // REGISTER OUR ROUTES -------------------------------
  app.use('/api', function (req, res, next) {
    console.log('API call: Method: ' + req.method +  ', URL: ' + req.url);

    // Make sure we go to the next routes and don't stop here
    next();
  })

  app.use('/api/auth',  auth);
  app.use('/api/users', users);
  app.use('/api/blog',  blog);
  app.use('/api/achievements', achievements)
}
