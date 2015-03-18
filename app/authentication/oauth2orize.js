var oauth2orize = require('oauth2orize');
var Promise = require('bluebird');

function setupExchanges(server) {
  server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
    // Validate client
    // Validate user
    // Issue token
  }));
}

module.exports = {
  init: function(server) {
    return new Promise (function(resolve, reject) {
      var oauth2orizeServer = oauth2orize.createServer();
      this.server = oauth2orizeServer;
      setupExchanges(oauth2orizeServer);
      resolve();
    });    
  },

  server: null
}