var colors    = require('colors');

// User Seeds
var User      = require('./../api/users/user.model');
var usersSeed = require('./data/users');

// Blog Post Seeds
var BlogPost      = require('./../api/blog/blog.post.model')
var blogPostsSeed = require('./data/blogposts');

// Blog Categories Seeds
var BlogCategory        = require('./../api/blog/categories/blog.category.model')
var blogCategoriesSeed  = require('./data/blogcategories');

// Achievements Seeds
var Achievement      = require('./../api/achievements/achievement.model')
var achievementsSeed = require('./data/achievements');

Achievement.find({}).removeAsync()
  .then(function() {
    console.log('ACHIEVEMENTS: Seeding...'.yellow)
    Achievement.createAsync(achievementsSeed)
      .then(function() {
        console.log('ACHIEVEMENTS: Done'.green.underline);

        // Achievements have to be present before user creation
        User.find({}).removeAsync()
          .then(function() {
            console.log('USERS: Seeding...'.yellow)
            User.createAsync(usersSeed)
              .then(function() {
                console.log('USERS: Done'.green.underline);
              });
          });
      });
  });

BlogCategory.find({}).removeAsync()
  .then(function() {
    console.log('BLOG CATEGORIES: Seeding...'.yellow)
    BlogCategory.createAsync(blogCategoriesSeed)
      .then(function() {
        console.log('BLOG CATEGORIES: Done'.green.underline);
      });
  });

BlogPost.find({}).removeAsync()
  .then(function() {
    console.log('BLOG POSTS: Seeding...'.yellow)
    BlogPost.createAsync(blogPostsSeed)
      .then(function() {
        console.log('BLOG POSTS: Done'.green.underline);
      });
  });
