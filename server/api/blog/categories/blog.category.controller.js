var _             = require('lodash');
var BlogCategory  = require('./blog.category.model');
var BlogPost      = require('./../blog.post.model')
var valMsg        = require('./../../validation.messages');

// Properties of documents we never want to return
var excludedReadParams = '-nameLowerCase';

/**
 * -----------------
 * CREATE
 * -----------------
 * Creates a new blog category
 */
exports.create = function(req, res, next) {
  var newCategory = new BlogCategory(req.body);

  newCategory.save(function(err) {
    var succMsg = valMsg.success.created.replace('{PATH}', 'blog category');
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
 * Fetches a single blog category and returns its document
 */
exports.read = function(req, res, next) {
  BlogCategory.findByIdAsync(req.params.id, excludedReadParams)
    .then(function(blogCategory) {
      var errMsg = valMsg.error.notFound.replace('{PATH}', 'blog category');

      if (!blogCategory) {
        return res.status(404).send(errMsg).end();
      }

      BlogPost.find()
        .where({ category: blogCategory._id })
        .select({ name: 1, user: 1, content: 1 })
        .populate({
          path: 'user',
          select: 'username',
          model: 'User'
        })
        .execAsync()
        .then(function(blogPosts) {
          var categoryDetails = {};

          categoryDetails.name = blogCategory.name;
          categoryDetails.posts = blogPosts;

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
 * Updates a given blog category, using the blog category ID
 */
exports.update = function(req, res, next) {

  // Sanity check incase the PUT has an '_id' value
  if (req.body._id) { 
    delete req.body._id; 
  }

  BlogCategory.findById(req.params.id, excludedReadParams, function (err, blogCat) {
    if (err) {
      return res.status(400).send(err).end();
    }

    if (_.isEmpty(req.body)) {
      var errMsg = valMsg.error.emptyBody;
      return res.status(200).send(errMsg);
    }

    if (!blogCat) {
      var errMsg = valMsg.error.notFound.replace('{PATH}', 'blog category')
      return res.status(404).send(errMsg); 
    }

    var updated = _.merge(blogCat, req.body);

    updated.save(function (err) {
      var succMsg = valMsg.success.updated.replace('{PATH}', 'blog category')
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
 * Delete a blog category from the collection
 */
exports.delete = function(req, res) {
  var succMsg = valMsg.success.deleted.replace('{PATH}', 'Blog category');
  var errMsg =  valMsg.error.notFound.replace('{PATH}', 'blog caegory')
  BlogCategory.findById(req.params.id, function (err, blogCat) {
    if (err) return res.status(400).end();
    if (!blogCat) {
      return res.status(404).send(errMsg); 
    }

    blogCat.remove(function(err) {
      if (err) return res.status(400).end();
      return res.status(200).send(succMsg);
    });
  });
};

/**
 * -----------------
 * LIST
 * -----------------
 * Displays a formatted list of all the blog categories inside the DB
 * It also uses pagingation
 * Excludes sensitive properties
 */
exports.list = function(req, res, next) {
  BlogCategory.count({}, function(err, count) {
    BlogCategory.find({})
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