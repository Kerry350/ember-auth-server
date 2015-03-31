var PasswordResetController = require('./../../../controllers/authentication/password-reset'); 

module.exports = {
  register: function(router) {
    router.post('/users/password-reset', PasswordResetController.forgottenPassword)
    router.put('/users/password-reset', PasswordResetController.resetPassword)
  }
};