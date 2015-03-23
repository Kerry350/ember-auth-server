var passport = require('passport');
var Promise = require('bluebird');
var BearerStrategy = require('passport-http-bearer');
var models = require('./../models');
var AccessToken = models.AccessToken;
var authenticateAccessToken = require('./tokens').authenticateAccessToken;

function setupStrategies() {
  passport.use(new BearerStrategy(
    function(token, done) {
      AccessToken.findOne({token: token})
      .exec()
      .then(function(accessToken) {
        if (!accessToken) {
          done(null, false);
        } else {
          authenticateAccessToken(accessToken)
          .then(function(user) {
            done(null, user);
          })
          .catch(function(err) {
            done(err);
          });
        }
      });
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