var colors    = require('colors');
var mongoose  = require('mongoose');
var bluebird  = require('bluebird');
var dbConfig    = require('./../config/db');

// Seeds
var User                = require('./../api/users/user.model');
var usersSeed           = require('./data/users');
var BlogPost            = require('./../api/blog/blog.post.model')
var blogPostsSeed       = require('./data/blogposts');
var BlogCategory        = require('./../api/blog/categories/blog.category.model')
var blogCategoriesSeed  = require('./data/blogcategories');
var Achievement         = require('./../api/achievements/achievement.model')
var achievementsSeed    = require('./data/achievements');

// MongoDB connection URI
var mongoUri = dbConfig.uri;

mongoose.Promise = bluebird;
mongoose.connect(mongoUri, function(err) {
  if (err) {
    throw err;
  }

  console.log('MongoDB connection established');
  mongoose.connection.db.dropDatabase(seedCommence);
});

function seedCommence() {

  console.log('DB DROPPED'.red.underline);

  return Promise.all([
    User.find({}).removeAsync()
    .then(function() {
      console.log('USERS: Seeding...'.yellow)
      return User.createAsync(usersSeed)
        .then(function() {
          console.log('USERS: Done'.green.underline);
        });
    }),

    Achievement.find({}).removeAsync()
    .then(function() {
      console.log('ACHIEVEMENTS: Seeding...'.yellow)
      return Achievement.createAsync(achievementsSeed)
        .then(function() {
          console.log('ACHIEVEMENTS: Done'.green.underline);
        });
    }),

    BlogCategory.find({}).removeAsync()
    .then(function() {
      console.log('BLOG CATEGORIES: Seeding...'.yellow)
      return BlogCategory.createAsync(blogCategoriesSeed)
        .then(function() {
          console.log('BLOG CATEGORIES: Done'.green.underline);
        });
    }),

  BlogPost.find({}).removeAsync()
    .then(function() {
      console.log('BLOG POSTS: Seeding...'.yellow)
      return BlogPost.createAsync(blogPostsSeed)
        .then(function() {
          console.log('BLOG POSTS: Done'.green.underline);
        });
    })
  ])
  .then(function() {
    process.exit(0);
  })
  .catch(function(err) {
    console.log(err);
    process.exit(1);
  })
}
