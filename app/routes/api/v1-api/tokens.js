var Controller = require('./../../../controllers/authentication/tokens'); 

module.exports = {
  register: function(router) {
    router.get('/token', Controller.get);
  }
};