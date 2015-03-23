var hat = require('hat');
var Promise = require('bluebird');
var models = require('./../models');
var User = models.User;
var AccessToken = models.AccessToken;
var RefreshToken = models.RefreshToken;
var timeUtils = require('./../utils/time');

/* Issues both an access token and a refresh token to a user */
function issueAccessAndRefreshToken(user) {
  return new Promise(function(resolve, reject) {
    var accessToken = new AccessToken({
      userId: user._id,
      scope: '*',
      token: hat(),
      expires: Date.now() + timeUtils.oneHourMs
    });

    accessToken.save(function(err, accessToken) {
      if (err) {
        reject(err);
      } else {
        // Issue refresh token
        var refreshToken = new RefreshToken({
          // clientId: , // TODO: Add in with client support
          userId: accessToken.userId,
          scope: accessToken.scope,
          token: hat(),
          expires: Date.now() + timeUtils.oneWeekMs,
          accessToken: accessToken.token
        });

        refreshToken.save(function(err, refreshToken) {
          if (err) {
            reject(err);
          } else {
            resolve({
              accessToken: accessToken.token, 
              refreshToken: refreshToken.token,
              expiresIn: 120 // TODO: Change this post-testing
            })               
          }
        });
      }
    });
  });
}

function exchangeRefreshTokenForAccessToken(refreshToken) {
  return new Promise(function(resolve, reject) {
    var accessToken = new AccessToken({
      userId: refreshToken.userId,
      scope: refreshToken.scope,
      token: hat(),
      expires: Date.now() + timeUtils.oneHourMs
    });

    accessToken.save(function(err, accessToken) {
      if (err) {
        reject(err);
      } else {
        // Issue refresh token
        var refreshToken = new RefreshToken({
          // clientId: , // TODO: Add in with client support
          userId: accessToken.userId,
          scope: accessToken.scope,
          token: hat(),
          expires: Date.now() + timeUtils.oneWeekMs,
          accessToken: accessToken.token
        });

        refreshToken.save(function(err, refreshToken) {
          if (err) {
            reject(err);
          } else {
            resolve({
              accessToken: accessToken.token, 
              refreshToken: refreshToken.token,
              expiresIn: 120 // TODO: Change this post-testing
            })               
          }
        });
      }
    });
  });
}

function authenticateAccessToken(accessToken) {
  return new Promise(function(resolve, reject) {
    User
    .findOne({_id: accessToken.userId})
    .exec()
    .then(function(user) {
      resolve(user);
    }, function(err) {
      reject(err);
    });
  });
}

module.exports = {
  issueAccessAndRefreshToken: issueAccessAndRefreshToken,
  exchangeRefreshTokenForAccessToken: exchangeRefreshTokenForAccessToken,
  authenticateAccessToken: authenticateAccessToken
};