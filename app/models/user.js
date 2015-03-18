var mongoose = require('mongoose');

var schema = mongoose.Schema({
  email: String,
  password: String,
  name: String
});

module.exports = mongoose.model('User', schema);