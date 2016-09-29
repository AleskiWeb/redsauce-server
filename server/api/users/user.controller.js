var _           = require('lodash');
var User        = require('./user.model');
var Achievement = require('./../achievements/achievement.model')
var valMsg      = require('./../validation.messages');

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

  newUser.personalDetails = {
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };

  // Populate the achievement array with relevant achievements (same store_id)
  Achievement.find()
    .where({ store_id: newUser.store_id })
    .select({ _id: 1 })
    .exec()
    .then(function(achievementsForStoreArray) {

      // For each of the achievements add a false flag and push them into the newUser.achievements array
      _.forEach(achievementsForStoreArray, function(achievementForStore) {
        var achievementObject = {};

        // Default to not having any of the achievements earned
        achievementObject._id = achievementForStore._id;
        achievementObject.earned = false;

        newUser.achievements.push(achievementObject);
      });

      newUser.save(function(err, user) {
        var succMsg = valMsg.success.created.replace('{PATH}', 'user');
        var partialSuccMsg = valMsg.warn.createdNoAchi.replace('{PATH}', 'user');

        if (err) {

          // IF the error code is 11000 that means its a MongoDB driver exception
          if (err.code === 11000) {

            // Duplication on email field error
            if (err.errmsg.indexOf('email') > -1) {
              var errMsg = valMsg.error.duplicate.replace('{PATH}', 'email');
              return res.status(400).send(errMsg).end();
            }

            // Duplication on username(LowerCase) field error
            if (err.errmsg.indexOf('usernameLowerCase') > -1) {
              var errMsg = valMsg.error.duplicate.replace('{PATH}', 'username');
              return res.status(400).send(errMsg).end();
            }
          } else {

            // UserSchema save validation error catch
            return res.status(400).send(err).end();
          }
        }

        if(user.achievements.length === 0) {

          // 201 for Creation - WARN no achievements
          res.status(201).send(partialSuccMsg).end();
        } else {

          // 201 for Creation
          res.status(201).send(succMsg).end();
        }
      });
    })
    .catch(function(err) {
      return res.status(400).send(err).end();
    })
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

    if (_.isEmpty(req.body)) {
      var errMsg = valMsg.error.emptyBody;
      return res.status(200).send(errMsg);
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
      var succMsg = valMsg.success.updated.replace('{PATH}', 'user')
      if (err) {
        return res.status(400).send(err).end();
      }

      return res.status(200).send(succMsg);
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
  var succMsg = valMsg.success.deleted.replace('{PATH}', 'User');
  var errMsg =  valMsg.error.notFound.replace('{PATH}', 'user')
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(400).end();
    if (!user) {
      return res.status(404).send(errMsg); 
    }

    user.remove(function(err) {
      if (err) return res.status(400).end();
      return res.status(200).send(succMsg);
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
      .populate({
          path: 'achievements',
          select: 'name',
          model: 'Achievement'
        })
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
  var errMsg = valMsg.error.noAuth;
  User.findOne({
    _id: req.user._id
  }, excludedReadParams, function(err, user) {
    if (err) {
      return next(err)
    }

    if (!user) return res.status(403).send(errMsg);
    res.json(user);
  });
};

/**
 * -----------------
 * UPDATEME
 * -----------------
 * Displays user profile information fora given specific
 * end user
 */
exports.updateMe = function(req, res, next) {
  var updateOptions = {
    name: req.body.name,
    email: req.body.email
  };

  if (req.body.password) {
    updateOptions.password = req.body.password;
  }

  User.findByIdAndUpdate(req.user._id, updateOptions).then(function(data, err) {
    if (err) {
      return res.status(500).end();
    }

    res.status(200).end();
  });
};
