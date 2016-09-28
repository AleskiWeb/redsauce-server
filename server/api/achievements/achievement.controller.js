var _           = require('lodash');
var Achievement = require('./achievement.model');
var valMsg      = require('./../validation.messages');

/**
 * -----------------
 * CREATE
 * -----------------
 * Creates a new achievement
 */
exports.create = function(req, res, next) {
  var newAchievement = new Achievement(req.body);

  newAchievement.save(function(err) {
    var succMsg = valMsg.success.created.replace('{PATH}', 'achievement');
    if (err) {

      // UserSchema save validation error catch
      return res.status(400).send(err).end();
    }

    // 201 for Creation
    res.status(201).send(succMsg).end();
  });
};

/**
 * -----------------
 * READ
 * -----------------
 * Fetches a single user and returns its model
 */
exports.read = function(req, res, next) {
  Achievement.findById(req.params.id, function(err, achievement) {
    var errMsg = valMsg.error.notFound.replace('{PATH}', 'achievement');
    if (err) {
      return res.status(400).send(err).end();
    }

    if (!achievement) {
      return res.status(404).send(errMsg).end();
    }

    res.status(200).json(achievement);
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

  Achievement.findById(req.params.id, function (err, achievement) {
    if (err) {
      return res.status(400).send(err).end();
    }

    if (_.isEmpty(req.body)) {
      var errMsg = valMsg.error.emptyBody;
      return res.status(200).send(errMsg);
    }

    if (!achievement) {
      var errMsg = valMsg.error.notFound.replace('{PATH}', 'achievement')
      return res.status(404).send(errMsg); 
    }

    var updated = _.merge(achievement, req.body);

    updated.save(function (err) {
      var succMsg = valMsg.success.updated.replace('{PATH}', 'achievement')
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
  var succMsg = valMsg.success.deleted.replace('{PATH}', 'Achievement');
  var errMsg =  valMsg.error.notFound.replace('{PATH}', 'achievement')
  Achievement.findById(req.params.id, function (err, achievement) {
    if (err) return res.status(400).end();
    if (!achievement) {
      return res.status(404).send(errMsg); 
    }

    achievement.remove(function(err) {
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
  Achievement.count({}, function(err, count) {
    Achievement.find({})
      .limit(req.query.pagesize)
      .skip((req.query.page * req.query.pagesize))
      .exec(function(err, docs) {
        res.status(200).json({
          docs: docs,
          count: count
        });
      });
  });
};
