var _             = require('lodash');
var Promise       = require('bluebird');
var Career      = require('./career.model');
var CareerCategory  = require('./categories/category.model');
var User          = require('./../users/user.model');
var valMsg        = require('./../validation.messages');

/**
 * -----------------
 * CREATE
 * -----------------
 * Creates a new user document
 */
exports.create = function(req, res, next) {
  var newCareer = new Career(req.body);

  newCareer.save(function(err) {
    var succMsg = valMsg.success.created.replace('{PATH}', 'career');
    if (err) {

      // CareerSchema save validation error catch
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
 * Fetches a single career document post and returns its model
 */
exports.read = function(req, res, next) {
  Career.findById(req.params.id)
  .populate({
    path: 'category',
    select: 'name',
    model: 'CareerCategory'
  })
  .exec(function(err, career) {
    var errMsg = valMsg.error.notFound.replace('{PATH}', 'career post');
    if (err) {
      return res.status(400).send(err).end();
    }

    if (!career) {
      return res.status(404).send(errMsg).end();
    }

    res.status(200).json(career);
  });
};

/**
 * -----------------
 * UPDATE
 * -----------------
 * Updates a given career post, using the ID
 */
exports.update = function(req, res, next) {

  // Sanity check incase the PUT has an '_id' value
  if (req.body._id) { 
    delete req.body._id; 
  }

  Career.findById(req.params.id, function (err, career) {
    if (err) {
      return res.status(400).send(err).end();
    }

    if (_.isEmpty(req.body)) {
      var errMsg = valMsg.error.emptyBody;
      return res.status(200).send(errMsg);
    }

    if (!career) {
      var errMsg = valMsg.error.notFound.replace('{PATH}', 'career')
      return res.status(404).send(errMsg); 
    }

    var updated = _.merge(career, req.body);

    updated.save(function (err) {
      var succMsg = valMsg.success.updated.replace('{PATH}', 'career')
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
 * Delete a career post from the collection
 */
exports.delete = function(req, res) {
  var succMsg = valMsg.success.deleted.replace('{PATH}', 'Career');
  var errMsg =  valMsg.error.notFound.replace('{PATH}', 'career')
  Career.findById(req.params.id, function (err, career) {
    if (err) return res.status(400).end();
    if (!career) {
      return res.status(404).send(errMsg); 
    }

    career.remove(function(err) {
      if (err) return res.status(400).end();
      return res.status(200).send(succMsg);
    });
  });
};

/**
 * -----------------
 * LIST
 * -----------------
 * Displays a formatted list of all the career posts inside the DB
 * It also uses pagingation
 * Excludes sensitive properties
 */
exports.list = function(req, res, next) {
  Career.count({}, function(err, count) {
    Career.find({})
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

/**
 * -----------------
 * LIST CATEGORIES WITH POSTS
 * -----------------
 * Displays a list of categories
 * with career posts belonging to each category attached
 * with user details attached for each career post
 */
exports.listWithCareers = function(req, res, next) {
  CareerCategory.find({}, function(err, careerCategories) {
    Promise.map(careerCategories, function(careerCategory) {
      return Career.find()
        .where({ category: careerCategory._id })
        .select({ name: 1, content: 1 })
        .execAsync()
        .then(function(careers) {
          var categoryDetails = {};
          
          categoryDetails.name = careerCategory.name;
          categoryDetails.description = careerCategory.description;
          categoryDetails.careers = careers;

          return categoryDetails;
        })
    })
    .then(function(career) {
      res.json(career);
    })
  })
}
