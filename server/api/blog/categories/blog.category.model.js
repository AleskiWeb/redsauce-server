var mongoose  = require('bluebird').promisifyAll(require('mongoose'));
var uuid      = require('node-uuid');
var valMsg    = require('./../../validation.messages');
var Schema    = mongoose.Schema;

var BlogCategorySchema = new Schema({
  _id               : { type: String, default: function () { return uuid.v4(); }, unique: true },
  name              : { type: String, required: true },
  nameLowerCase     : { type: String, index: { unique: true } },
  created           : { type: Date, default: Date.now }
});

// This mongoose middleware will ONLY be invoked by SAVE and NOT UPDATE
BlogCategorySchema.pre('save', function (next) {
  var blogCat = this;

  // Create the lower case version of the name for indexing and comparing functions
  blogCat.nameLowerCase = blogCat.name.toLowerCase();
  next();
});

module.exports = mongoose.model('BlogCategory', BlogCategorySchema);
