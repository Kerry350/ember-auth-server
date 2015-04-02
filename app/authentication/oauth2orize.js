var oauth2orize = require('oauth2orize');
var Promise = require('bluebird');
var hat = require('hat');
var models = require('./../models');
var User = models.User;
var RefreshToken = models.RefreshToken;
var issueAccessAndRefreshToken = require('./tokens').issueAccessAndRefreshToken;
var exchangeRefreshTokenForAccessToken = require('./tokens').exchangeRefreshTokenForAccessToken;

function setupExchanges(server) {
  // Password grant type
  server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
    User.findOne({
      email: username
    })
    .exec()
    .then(function(user) {
      if (!user) {
        done(null, false);
      } else {
        user
        .comparePassword(password)
        .then(function(match) {
          if (match) {
            issueAccessAndRefreshToken(user, client)
            .then(function(tokenData) {
              done(null, tokenData.accessToken, tokenData.refreshToken, {expires_in: tokenData.expiresIn});                
            })
            .catch(function(err) {
              return done(err);
            });
          } else {
            return done(null, false);
          }
        })
        .catch(function(err) {
          done(err);
        });
      }
    });
  }));


  // Refresh token grant type 
  server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) { 
    RefreshToken
    .findOne({token: refreshToken})
    .exec()
    .then(function(refreshToken) {
      if (!refreshToken) {
        done(null, false);
      } else {
        if (Date.now() > refreshToken.expires) {
          done(null, false);
        } else {
          exchangeRefreshTokenForAccessToken(refreshToken, client)
          .then(function(tokenData) {
            done(null, tokenData.accessToken, tokenData.refreshToken, {expires_in: tokenData.expiresIn});                
          })
          .catch(function(err) {
            done(err);
          });
        }
      }
    })
  }))
}

module.exports = {
  init: function(server) {
    return new Promise (function(resolve, reject) {
      var oauth2orizeServer = oauth2orize.createServer();
      this.server = oauth2orizeServer;
      setupExchanges(oauth2orizeServer);
      resolve();
    }.bind(this));    
  },

  server: null
}