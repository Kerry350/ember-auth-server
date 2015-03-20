var mongoose = require('mongoose');

var schema = mongoose.Schema({
  name: String,
  redirectUri: String,
  secret: String
});

module.exports = mongoose.model('Client', schema);