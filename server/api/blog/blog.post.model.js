var mongoose  = require('bluebird').promisifyAll(require('mongoose'));
var uuid      = require('node-uuid');
var valMsg    = require('./../validation.messages');
var Schema    = mongoose.Schema;

var BlogPostSchema = new Schema({
  _id               : { type: String, default: function () { return uuid.v4(); }, unique: true },
  category          : { type: String, ref: 'BlogCategory', required: true },
  user              : { type: String, ref: 'User', required: true },
  name              : { type: String, required: true },
  created           : { type: Date, default: Date.now },
  updated           : { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
