var bcrypt       = require('bcrypt');
var mongoose     = require('mongoose');
var uuid         = require('node-uuid');
var valMsg       = require('./../validation.messages');
var Schema       = mongoose.Schema;

// Password regex for 1 uppercase, 1 lowercase, 1 non-lphanumerical and 1 number of atleast 8 long
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/i;

/**
 * Set the SALT computational complexity.
 * Higher === Better salting
 * Lower === Faster salting
 */ 
var SALT_WORK_FACTOR = 10;

var UserSchema   = new Schema({
  _id               : { type: String, default: function () { return uuid.v4(); }, unique: true },
  username          : { type: String, required: true },
  usernameLowerCase : { type: String, index: { unique: true } },
  email             : { type: String, trim: true, lowercase: true, unique: true },
  password          : { type: String },
  role              : { type: String, default: 'user' },
  created           : { type: Date, default: Date.now },
  updated           : { type: Date, default: Date.now }
});

// Email validation properties
UserSchema.path('email')

  // Email must have a value
  .validate(function (value) {
    return value.length;
  }, valMsg.error.empty)

  // Email must follow x@x.x format
  .validate(function (value) {
    return /.+\@.+\..+/.test(value);
  }, valMsg.error.format)

// Password validation properties
UserSchema.path('password')

  // Password must have a value
  .validate(function (value) {
    return value.length;
  }, valMsg.error.empty)

  // Password must match rules
  .validate(function (value) {
    return passwordRegex.test(value);
  }, valMsg.error.format);

// This mongoose middleware will ONLY be invoked by SAVE and NOT UPDATE
UserSchema.pre('save', function (next) {
  var user = this;

  // Create the lower case version of the name for indexing and comparing functions
  user.usernameLowerCase = user.username.toLowerCase();

  // New documents don't need the updated field changing 
  if (!user.isNew) {
    user.updated = Date.now();
  }
  
  // Check to see if the password has changed before hashing it again
  if (!user.isModified('password')) {
    return next();
  }
  
  // Generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }
    
    // Hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }

      // Overide the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// Compare the password saved and the password generated using the salt
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  })
}

module.exports = mongoose.model('User', UserSchema);
