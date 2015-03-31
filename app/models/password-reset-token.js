var mongoose = require('mongoose');

var schema = mongoose.Schema({
  userId: String,
  email: String,
  token: String,
  expires: Date
});

module.exports = mongoose.model('passwordResetToken', schema);