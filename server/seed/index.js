var colors    = require('colors');

// User Seeds
var User      = require('./../api/users/user.model');
var userSeed  = require('./data/users');

// Blog Post Seeds
var BlogPost      = require('./../api/blog/blog.post.model')
var blogPostSeed  = require('./data/blogposts');

// Blog Categories Seeds
var BlogCategory      = require('./../api/blog/categories/blog.category.model')
var blogCategorySeed  = require('./data/blogcategories');

User.find({}).removeAsync()
  .then(function() {
    console.log('USERS: Seeding...'.yellow)
    User.createAsync(userSeed)
      .then(function() {
        console.log('USERS: Done'.green.underline);
      });
  });

BlogCategory.find({}).removeAsync()
  .then(function() {
    console.log('BLOG CATEGORIES: Seeding...'.yellow)
    BlogCategory.createAsync(blogCategorySeed)
      .then(function() {
        console.log('BLOG CATEGORIES: Done'.green.underline);
      });
  });

BlogPost.find({}).removeAsync()
  .then(function() {
    console.log('BLOG POSTS: Seeding...'.yellow)
    BlogPost.createAsync(blogPostSeed)
      .then(function() {
        console.log('BLOG POSTS: Done'.green.underline);
      });
  });
