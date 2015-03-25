var passport = require('passport');
var Promise = require('bluebird');
var BearerStrategy = require('passport-http-bearer');
var ClientPasswordStrategy = require('passport-oauth2-client-password');
var models = require('./../models');
var AccessToken = models.AccessToken;
var Client = models.Client;
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

  passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
      Client.findOne({_id: clientId})
      .exec()
      .then(function(client) {
        if (!client) {
          done(null, false);
        } else {
          done(null, client);
        }
      }, function(err) {
        done(err);
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