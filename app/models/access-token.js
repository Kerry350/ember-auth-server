var mongoose = require('mongoose');

var schema = mongoose.Schema({
  clientId: String, 
  userId: String,
  scope: String,
  expires: Date,
  token: String
});

module.exports = mongoose.model('accessToken', schema);