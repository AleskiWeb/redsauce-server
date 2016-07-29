var _       = require('lodash');
var User    = require('./user.model');
var valMsg  = require('./../validation.messages');

// Properties of documents we never want to return
var excludedReadParams = '-password -__v -usernameLowerCase';

/**
 * -----------------
 * CREATE
 * -----------------
 * Creates a new user
 */
exports.create = function(req, res, next) {
  var newUser = new User(req.body);

  newUser.save(function(err) {
    var errMsg = valMsg.success.created.replace('{PATH}', 'user');
    if (err) {

      /**
       * TODO: Handle MongoDB Errors (Like Dup Key)
       * Consider changing this to the preferred implementation of emulating Mongoose errors
       * 
       * Currently just checks for the error code for dup key from MongoDB response
       */
      if (err.code === 11000) {

        // Duplication on email field error
        if (err.errmsg.indexOf('$email') > -1) {
          var errMsg = valMsg.error.duplicate.replace('{PATH}', 'email');
          return res.status(400).send(errMsg).end();
        }

        // Duplication on username(LowerCase) field error
        if (err.errmsg.indexOf('$usernameLowerCase') > -1) {
          var errMsg = valMsg.error.duplicate.replace('{PATH}', 'username');
          return res.status(400).send(errMsg).end();
        }
        
      } else {

        // UserSchema save validation error catch
        return res.status(400).send(err).end();
      }
    }

    // 201 for Creation
    res.status(201).send(errMsg).end();
  });
};

/**
 * -----------------
 * READ
 * -----------------
 * Fetches a single user and returns its model
 */
exports.read = function(req, res, next) {
  User.findById(req.params.id, excludedReadParams, function(err, user) {
    var errMsg = valMsg.error.notFound.replace('{PATH}', 'user');

    if (err) {
      return res.status(400).send(err).end();
    }

    if (!user) {
      return res.status(404).send(errMsg).end();
    }

    res.status(200).json(user);
  });
};

/**
 * -----------------
 * UPDATE
 * -----------------
 * Updates a given user, using the user ID
 */
exports.update = function(req, res, next) {

  // Sanity check incase the PUT has an '_id' value
  if (req.body._id) { 
    delete req.body._id; 
  }

  User.findById(req.params.id, excludedReadParams, function (err, user) {
    if (err) {
      return res.status(400).send(err).end();
    }

    if (!user) {
      var errMsg = valMsg.error.notFound.replace('{PATH}', 'user')
      return res.status(404).send(errMsg); 
    }

    if(req.body.password) {
      user.password = req.body.password;
    }

    var updated = _.merge(user, req.body);

    updated.save(function (err) {
      var errMsg = valMsg.success.updated.replace('{PATH}', 'user')

      if (err) {
        return res.status(400).send(err).end();
      }

      return res.status(200).send(errMsg);
    });
  });
};

/**
 * -----------------
 * DELETE
 * -----------------
 * Delete a user from the collection
 */
exports.delete = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(400).end();
    if (!user) { 
      return res.status(404).send('Not Found'); 
    }

    user.remove(function(err) {
      if (err) return res.status(400).end();
      return res.status(204).send('No Content');
    });
  });
};

/**
 * -----------------
 * LIST
 * -----------------
 * Displays a formatted list of all the users inside the DB
 * It also uses pagingation
 * Excludes sensitive properties
 */
exports.list = function(req, res, next) {
  User.count({}, function(err, count) {
    User.find({})
      .limit(req.query.pagesize)
      .skip((req.query.page * req.query.pagesize))
      .select(excludedReadParams)
      .exec(function(err, docs) {
        res.status(200).json({
          docs: docs,
          count: count
        });
      });
  });
};

/**
 * -----------------
 * ME
 * -----------------
 * Displays user profile information fora given specific
 * end user
 */
exports.me = function(req, res, next) {
  User.findOne({
    _id: req.user._id
  }, excludedReadParams, function(err, user) {
    if (err) {
      return next(err)
    }

    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};