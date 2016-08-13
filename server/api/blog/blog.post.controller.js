var _             = require('lodash');
var Promise       = require('bluebird');
var BlogPost      = require('./blog.post.model');
var BlogCategory  = require('./categories/blog.category.model');
var User          = require('./../users/user.model');
var valMsg        = require('./../validation.messages');

/**
 * -----------------
 * CREATE
 * -----------------
 * Creates a new user
 */
exports.create = function(req, res, next) {
  var newBlogPost = new BlogPost(req.body);

  newBlogPost.save(function(err) {
    var succMsg = valMsg.success.created.replace('{PATH}', 'blog post');
    if (err) {

      // BlogPostSchema save validation error catch
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
 * Fetches a single blog post and returns its model
 */
exports.read = function(req, res, next) {
  BlogPost.findById(req.params.id)
  .populate({
    path: 'user',
    select: 'username',
    model: 'User'
  })
  .populate({
    path: 'category',
    select: 'name',
    model: 'BlogCategory'
  })
  .exec(function(err, blogPost) {
    var errMsg = valMsg.error.notFound.replace('{PATH}', 'blog post');
    if (err) {
      return res.status(400).send(err).end();
    }

    if (!blogPost) {
      return res.status(404).send(errMsg).end();
    }

    res.status(200).json(blogPost);
  });
};

/**
 * -----------------
 * UPDATE
 * -----------------
 * Updates a given blog post, using the ID
 */
exports.update = function(req, res, next) {

  // Sanity check incase the PUT has an '_id' value
  if (req.body._id) { 
    delete req.body._id; 
  }

  BlogPost.findById(req.params.id, function (err, blogPost) {
    if (err) {
      return res.status(400).send(err).end();
    }

    if (_.isEmpty(req.body)) {
      var errMsg = valMsg.error.emptyBody;
      return res.status(200).send(errMsg);
    }

    if (!blogPost) {
      var errMsg = valMsg.error.notFound.replace('{PATH}', 'blog post')
      return res.status(404).send(errMsg); 
    }

    var updated = _.merge(blogPost, req.body);

    updated.save(function (err) {
      var succMsg = valMsg.success.updated.replace('{PATH}', 'blog post')
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
 * Delete a blog post from the collection
 */
exports.delete = function(req, res) {
  var succMsg = valMsg.success.deleted.replace('{PATH}', 'Blog post');
  var errMsg =  valMsg.error.notFound.replace('{PATH}', 'blog post')
  BlogPost.findById(req.params.id, function (err, blogPost) {
    if (err) return res.status(400).end();
    if (!blogPost) {
      return res.status(404).send(errMsg); 
    }

    blogPost.remove(function(err) {
      if (err) return res.status(400).end();
      return res.status(200).send(succMsg);
    });
  });
};

/**
 * -----------------
 * LIST
 * -----------------
 * Displays a formatted list of all the blog posts inside the DB
 * It also uses pagingation
 * Excludes sensitive properties
 */
exports.list = function(req, res, next) {
  BlogPost.count({}, function(err, count) {
    BlogPost.find({})
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
 * with blog posts belonging to each category attached
 * with user details attached for each blog post
 */
exports.listWithPosts = function(req, res, next) {
  BlogCategory.find({}, function(err, blogCategories) {
    Promise.map(blogCategories, function(blogCategory) {
      return BlogPost.find()
        .where({ category: blogCategory._id })
        .select({ name: 1, updated: 1, user: 1 })
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

          return categoryDetails;
        })
    }).then(function(blog) {
      res.json(blog);
    })
  })
}
