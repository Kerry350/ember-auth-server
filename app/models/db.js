var mongoose = require('mongoose');
var Promise = require('bluebird');

function connect() {
  return mongoose.connect('mongodb://localhost/ember-auth');
}

module.exports = {
  init: function() {
    return new Promise(function(resolve, reject) {
      connect();
      resolve();
    });
  }
}