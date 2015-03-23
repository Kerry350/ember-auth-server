var passport = require('passport');
var hat = require('hat');

module.exports = {
  register: function(router) {
    /* Demonstrates the Bearer strategy being used. We just send some fake data back */
    router.get('/settings', passport.authenticate('bearer', {session: false}), function(req, res) {
      res.status(200).send({
        settings: [{
          _id: hat(),
          notifications: true
        }]
      });
    });
  }
};