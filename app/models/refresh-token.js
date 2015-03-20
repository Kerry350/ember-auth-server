var mongoose = require('mongoose');

var schema = mongoose.Schema({
  clientId: String, 
  userId: String,
  scope: String,
  expires: Date,
  token: String,
  accessToken: String
});

module.exports = mongoose.model('refreshToken', schema);