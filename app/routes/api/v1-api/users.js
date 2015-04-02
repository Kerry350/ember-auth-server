var PasswordResetController = require('./../../../controllers/authentication/password-reset'); 
var UsersController = require('./../../../controllers/users');

module.exports = {
  register: function(router) {
    router.post('/users/password-reset', PasswordResetController.forgottenPassword);
    router.put('/users/password-reset', PasswordResetController.resetPassword);
    router.post('/users', UsersController.create);
  }
};