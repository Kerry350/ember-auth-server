var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Promise = require('bluebird');

var schema = mongoose.Schema({
  email: String,
  password: String,
  name: String,

  /* Facebook */
  facebookUID: String
});

// Hash passwords on save
schema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  } else {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(this.password, salt, function(err, hash) {
        this.password = hash;
        return next();
      }.bind(this));
    }.bind(this));
  }
});

schema.methods = {
  comparePassword: function(password) {
    return new Promise(function(resolve, reject) {
      bcrypt.compare(password, this.password, function(err, match) {
        if (err) {
          reject(err);
        } else {
          resolve(match);
        }
      });
    }.bind(this));
  }
}

module.exports = mongoose.model('User', schema);