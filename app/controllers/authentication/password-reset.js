var generatePasswordResetToken = require('./../../authentication/tokens').generatePasswordResetToken; 
var PasswordResetToken = require('./../../models').PasswordResetToken; 
var User = require('./../../models').User;
var mailService = require('./../../services/mail');

module.exports = {
  forgottenPassword: function(req, res) {
    generatePasswordResetToken(req.body.email)
    .then(function(token) {
      if (token) {
        // Send success email
        var options = {
          from: 'passwords@' + process.env.MAILGUN_DOMAIN,
          to: token.email,
          subject: 'Password reset requested',
          body: 'Please click the following link to reset your password:' + process.env.PASSWORD_RESET_URL + '?token=' + token.token,
          html: "Please click the following link to reset your password: <a href='" + process.env.PASSWORD_RESET_URL + "?token=" + token.token + "'>Reset Password</a>"
        }

        mailService.sendEmail(options);
      } else {
        // Send "you're not in our records" email
        var message = "A password reset was requested on behalf of this email address. Our records indicate you do not have an account. No further action is needed.";
        
        var options = {
          from: 'passwords@' + process.env.MAILGUN_DOMAIN,
          to: token.email,
          subject: 'Password reset requested',
          body: message,
          html: message
        }

        mailService.sendEmail(options);
      }

      return res.status(200).send();
    })
    .catch(function(err) {
      return res.status(500).send([{
        error: "Sorry, something went wrong"
      }])
    });
  },

  resetPassword: function(req, res) {
    var passwordResetToken = req.body.passwordResetToken;
    var password = req.body.password;
    var passwordConfirmation = req.body.passwordConfirmation;

    if (password !== passwordConfirmation) {
      return req.status(400).send([{
        error: 'Passwords do not match'
      }])
    }

    PasswordResetToken
    .findOne({token: passwordResetToken})
    .exec()
    .then(function(token) {
      if (!token) {
        return res.status(500).send([{
          error: 'Sorry, something went wrong'
        }]);
      } else {
        if (Date.now() > token.expires) {
          return res.status(400).send([{
            error: 'Reset link has expired. Please request another password reset email.'
          }]);
        } else {
          User
          .findOne({email: token.email}) 
          .exec()
          .then(function(user) {
            user.password = password; // Hash / salt this in production!
            user.save(function(err, user) {
              if (err) {
                return res.status(500).send([{error: "Sorry, something went wrong"}])
              } else {
                PasswordResetToken.remove({token: passwordResetToken}, function(err) {
                  if (err) {
                    console.log(err);
                  }
                });
                return res.status(200).send();
              }
            });
          })
        }
      }
    });
  }
};