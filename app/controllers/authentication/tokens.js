var FB = require('fb');
var Promise = require('bluebird');
var models = require('./../../models');
var hat = require('hat');
var User = models.User;
var AccessToken = models.AccessToken;
var RefreshToken = models.RefreshToken;
var issueAccessAndRefreshToken = require('./../../authentication/tokens').issueAccessAndRefreshToken;

module.exports = {
  // Takes an authorisation code and exchanges it for an access token
  // The access token is then used to acquire a profile, which can 
  // then be used to link the 3rd Party information to a user account
  authenticateWithFacebook: function(req, res) {
    FB.api('oauth/access_token', {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        redirect_uri: 'http://localhost:4200/',
        code: req.body.code
    }, function(data) {
        if (data && data.error) {
          res.status(401).send({error: data.error});
        }

        var accessToken = data.access_token;

        FB.api('me?access_token=' + accessToken, function(user) {
            if (data && data.error) {
              return res.status(401).send()
            }

            findOrCreateUserForFacebookAccount(user)
            .then(function(user) {
              return issueAccessAndRefreshToken(user);
            })
            .then(function(tokenData) {
              res.status(200).send({
                access_token: tokenData.accessToken,
                refresh_token: tokenData.refreshToken,
                expires_in: tokenData.expiresIn,
                type: 'Bearer'
              })
            });
        });
    });
  }
};

function findOrCreateUserForFacebookAccount(profile) {
  return User.findOne({
    $or: [
      {facebookUID: profile.id},
      {email: profile.email}
    ]
  })
  .exec()
  .then(function(user) {
    if (user) {
      return user;
    } else {
      return new Promise(function(resolve, reject) {
        var user = new User({
          name: profile.name, 
          email: profile.email,
          facebookUID: profile.id
        });

        user.save(function(err, user) {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      });
    }
  })
}