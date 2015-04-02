var User = require('./../models').User;

module.exports = {
  create: function(req, res) {
    var user = new User({
      email: req.body.user.email,
      password: req.body.user.password
    });

    user.save(function(err, user) {
      if (err) {
        return res.status(500).send([{error: "Sorry, something went wrong"}]);
      } else {
        return res.status(201).send({user: user});
      } 
    });
  }
}