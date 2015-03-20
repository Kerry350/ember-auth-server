var Controller = require('./../../../controllers/authentication/tokens'); 
var oauth2orizeServer = require('./../../../authentication/oauth2orize').server; 

module.exports = {
  register: function(router) {
    router.post('/token', oauth2orizeServer.token());
    router.post('/facebook/token', Controller.exchangeFacebookCodeForToken);
    router.post('/github/token', Controller.exchangeGitHubCodeForToken)
  }
};