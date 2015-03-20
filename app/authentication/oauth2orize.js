var oauth2orize = require('oauth2orize');
var Promise = require('bluebird');
var models = require('./../models');
var hat = require('hat');

function setupExchanges(server) {
  var ONE_HOUR_MS = 3600000;  
  var ONE_WEEK_MS = 604800000; 
  var User = models.User;
  var AccessToken = models.AccessToken;
  var RefreshToken = models.RefreshToken;

  // Password grant type
  server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
    // TODO: Validate client, i.e. add client credential sending to the front-end, then make add a client middleware
    // Validate user
    User.findOne({
      email: username,
      password: password // In production we would need to do a Bcrypt comparison (or whichever password protection you were using)
    })
    .exec()
    .then(function(user) {
      if (!user) {
        done(null, false);
      } else {
        // Issue access token
        var accessToken = new AccessToken({
          // clientId: , // TODO: Add in with client support
          userId: user._id,
          scope: '*',
          token: hat(),
          expires: Date.now() + ONE_HOUR_MS
        });

        accessToken.save(function(err, accessToken) {
          if (err) {
            done(err);
          } else {
            // Issue refresh token
            var refreshToken = new RefreshToken({
              // clientId: , // TODO: Add in with client support
              userId: user._id,
              scope: accessToken.scope,
              token: hat(),
              expires: Date.now() + ONE_WEEK_MS,
              accessToken: accessToken.token
            });

            refreshToken.save(function(err, refreshToken) {
              if (err) {
                done(err);
              } else {
                done(null, accessToken.token, refreshToken.token, {expires_in: 120});                
              }
            });
          }
        });
      }
    });
  }));


  // Refresh token grant type 
  server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) { 
    // TODO: Validate client
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
          var accessToken = new AccessToken({
            userId: refreshToken.userId,
            scope: refreshToken.scope,
            token: hat(),
            expires: Date.now() + ONE_HOUR_MS
          });

          accessToken.save(function(err, accessToken) {
            if (err) {
              done(err);
            } else {
              // Issue refresh token
              var refreshToken = new RefreshToken({
                // clientId: , // TODO: Add in with client support
                userId: accessToken.userId,
                scope: accessToken.scope,
                token: hat(),
                expires: Date.now() + ONE_WEEK_MS,
                accessToken: accessToken.token
              });

              refreshToken.save(function(err, refreshToken) {
                if (err) {
                  done(err);
                } else {
                  done(null, accessToken.token, refreshToken.token, {expires_in: 120});                
                }
              });
            }
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