var passport = require('passport');
var Promise = require('bluebird');
var BearerStrategy = require('passport-http-bearer');

function setupStrategies() {
  passport.use(new BearerStrategy(
    function(token, done) {

    }
  ));
}

module.exports = {
  init: function(server) {
    return new Promise(function(resolve, reject) {
      setupStrategies();
      server.use(passport.initialize());
      resolve();
    }); 
  }
}