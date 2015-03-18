var mongoose = require('mongoose');

var schema = mongoose.Schema({
  name: String,
  redirectionUrl: String
});

module.exports = mongoose.model('Client', schema);