var _              = require('lodash');
var CareerCategory = require('./category.model');
var Career         = require('./../career.model')
var valMsg         = require('./../../validation.messages');

// Properties of documents we never want to return
var excludedReadParams = '-nameLowerCase';

/**
 * -----------------
 * CREATE
 * -----------------
 * Creates a new career category
 */
exports.create = function(req, res, next) {
  var newCategory = new CareerCategory(req.body);

  newCategory.save(function(err) {
    var succMsg = valMsg.success.created.replace('{PATH}', 'career category');
    if (err) {
      
      if (err.code === 11000) {

        // Duplication on name(LowerCase) field error
        if (err.errmsg.indexOf('nameLowerCase') > -1) {
          var errMsg = valMsg.error.duplicate.replace('{PATH}', 'name');
          return res.status(400).send(errMsg).end();
        }
      } else {

        // Schema save validation error catch
        return res.status(400).send(err).end();
      }
    }

    // 201 for Creation
    res.status(201).send(succMsg).end();
  });
};

/**
 * -----------------
 * READ
 * -----------------
 * Fetches a single career category and returns its document
 */
exports.read = function(req, res, next) {
  CareerCategory.findByIdAsync(req.params.id, excludedReadParams)
    .then(function(careerCategory) {
      var errMsg = valMsg.error.notFound.replace('{PATH}', 'career category');

      if (!careerCategory) {
        return res.status(404).send(errMsg).end();
      }

      Career.find()
        .where({ category: careerCategory._id })
        .select({ name: 1, user: 1, content: 1 })
        .populate({
          path: 'user',
          select: 'username',
          model: 'User'
        })
        .execAsync()
        .then(function(careers) {
          var categoryDetails = {};

          categoryDetails.name = careerCategory.name;
          categoryDetails.careers = careers;

          res.status(200).json(categoryDetails);
        })
    })
    .catch(function(err) {
      return res.status(400).send(err).end();
    })
};

/**
 * -----------------
 * UPDATE
 * -----------------
 * Updates a given career category, using the career category ID
 */
exports.update = function(req, res, next) {

  // Sanity check incase the PUT has an '_id' value
  if (req.body._id) { 
    delete req.body._id; 
  }

  CareerCategory.findById(req.params.id, excludedReadParams, function (err, careerCat) {
    if (err) {
      return res.status(400).send(err).end();
    }

    if (_.isEmpty(req.body)) {
      var errMsg = valMsg.error.emptyBody;
      return res.status(200).send(errMsg);
    }

    if (!careerCat) {
      var errMsg = valMsg.error.notFound.replace('{PATH}', 'career category')
      return res.status(404).send(errMsg); 
    }

    var updated = _.merge(careerCat, req.body);

    updated.save(function (err) {
      var succMsg = valMsg.success.updated.replace('{PATH}', 'career category')
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
 * Delete a career category from the collection
 */
exports.delete = function(req, res) {
  var succMsg = valMsg.success.deleted.replace('{PATH}', 'Career category');
  var errMsg =  valMsg.error.notFound.replace('{PATH}', 'career caegory')
  CareerCategory.findById(req.params.id, function (err, careerCat) {
    if (err) return res.status(400).end();
    if (!careerCat) {
      return res.status(404).send(errMsg); 
    }

    careerCat.remove(function(err) {
      if (err) return res.status(400).end();
      return res.status(200).send(succMsg);
    });
  });
};

/**
 * -----------------
 * LIST
 * -----------------
 * Displays a formatted list of all the career categories inside the DB
 * It also uses pagingation
 * Excludes sensitive properties
 */
exports.list = function(req, res, next) {
  CareerCategory.count({}, function(err, count) {
    CareerCategory.find({})
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