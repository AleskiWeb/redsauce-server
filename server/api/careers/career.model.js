var mongoose  = require('bluebird').promisifyAll(require('mongoose'));
var uuid      = require('node-uuid');
var valMsg    = require('./../validation.messages');
var Schema    = mongoose.Schema;

var CareerSchema = new Schema({
  _id               : { type: String, default: function () { return uuid.v4(); }, unique: true },
  category          : { type: String, ref: 'CareerCategory', required: true },
  title             : { type: String, required: true },
  created           : { type: Date, default: Date.now },
  updated           : { type: Date, default: Date.now },
  content           : {
    introText         : { type: String },
    headerImg         : { type: String },
    description       : { type: String },
    requirements      : { type: String },
    bonusRequirements : { type: String },
  }
});

module.exports = mongoose.model('Career', CareerSchema);
