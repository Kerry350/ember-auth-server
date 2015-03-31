var hat = require('hat');
var Promise = require('bluebird');
var models = require('./../models');
var User = models.User;
var AccessToken = models.AccessToken;
var RefreshToken = models.RefreshToken;
var PasswordResetToken = models.PasswordResetToken;
var timeUtils = require('./../utils/time');

/* Issues both an access token and a refresh token to a user */
function issueAccessAndRefreshToken(user, client) {
  return new Promise(function(resolve, reject) {
    var accessToken = new AccessToken({
      userId: user._id,
      scope: '*',
      token: hat(),
      expires: Date.now() + timeUtils.oneHourMs,
      clientId: client._id
    });

    accessToken.save(function(err, accessToken) {
      if (err) {
        reject(err);
      } else {
        // Issue refresh token
        var refreshToken = new RefreshToken({
          clientId: client._id,
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

function exchangeRefreshTokenForAccessToken(refreshToken, client) {
  return new Promise(function(resolve, reject) {
    var accessToken = new AccessToken({
      userId: refreshToken.userId,
      scope: refreshToken.scope,
      token: hat(),
      expires: Date.now() + timeUtils.oneHourMs,
      clientId: client._id
    });

    accessToken.save(function(err, accessToken) {
      if (err) {
        reject(err);
      } else {
        // Issue refresh token
        var refreshToken = new RefreshToken({
          clientId: client._id,
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

/* Resolves with a token if user existed. Or null if they didn't */
function generatePasswordResetToken(email) {
  return new Promise(function(resolve, reject) {
    User
    .findOne({email: email})
    .exec()
    .then(function(user) {
      if (user) {
        var passwordResetToken = new PasswordResetToken({
          userId: user._id,
          email: user.email,
          token: hat(),
          expires: Date.now() + timeUtils.oneHourMs
        });

        passwordResetToken.save(function(err, token) {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        });
      } else {
        resolve(null);
      }
    }, function(err) {
      reject(err);
    });
  });
}

module.exports = {
  issueAccessAndRefreshToken: issueAccessAndRefreshToken,
  exchangeRefreshTokenForAccessToken: exchangeRefreshTokenForAccessToken,
  authenticateAccessToken: authenticateAccessToken,
  generatePasswordResetToken: generatePasswordResetToken
};