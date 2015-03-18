var passport = require('./passport');
var oauth2orize = require('./oauth2orize');

module.exports = {
  init: function(server) {
    return passport
    .init(server)
    .then(function() {
      return oauth2orize.init(server);
    });  
  }
}