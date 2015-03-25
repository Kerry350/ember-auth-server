var Controller = require('./../../../controllers/authentication/tokens'); 
var oauth2orizeServer = require('./../../../authentication/oauth2orize').server; 
var passport = require('passport');

module.exports = {
  register: function(router) {
    router.post('/token', passport.authenticate('oauth2-client-password', {session: false}), function(req, res) {
      if (req.body.grant_type === 'password' || req.body.grant_type === 'refresh_token') {
        return oauth2orizeServer.token()(req, res);
      } else if ((req.body.grant_type === 'authorization_code') && req.body.provider) {
        if (req.body.provider === 'facebook-oauth2') {
          return Controller.authenticateWithFacebook(req, res);
        }
      }
    });
  }
};