var Controller = require('./../../../controllers/authentication/tokens'); 
var oauth2orizeServer = require('./../../../authentication/oauth2orize').server; 

module.exports = {
  register: function(router) {
    router.post('/token', oauth2orizeServer.token());
  }
};