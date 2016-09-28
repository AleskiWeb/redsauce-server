var mongoose  = require('bluebird').promisifyAll(require('mongoose'));
var uuid      = require('node-uuid');
var valMsg    = require('./../validation.messages');
var Schema    = mongoose.Schema;

var AchievementSchema   = new Schema({
  _id           : { type: String, default: function () { return uuid.v4(); }, unique: true },
  store_id      : { type: String, required: true },
  name          : { type: String, required: true },
  description   : { type: String }
});

// Email validation properties
AchievementSchema.path('name')

  // Email must have a value
  .validate(function (value) {
    return value.length;
  }, valMsg.error.empty)

module.exports = mongoose.model('Achievement', AchievementSchema);
