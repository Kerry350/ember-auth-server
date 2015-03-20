var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var Promise = require('bluebird');
var chalk = require('chalk');
var models = require('./models'); 
var hat = require('hat');
var cors = require('cors');
var bodyParser = require('body-parser')

function AuthApp() {};

AuthApp.start = function() {
  return new AuthApp().start();
}

AuthApp.prototype = {
  start: function() {
    console.log(chalk.green("Booting Application ✓"));
    
    return require('./models/db')
    .init()
    .then(function() {
      return this.seedDatabase();
    }.bind(this))
    .then(function() {
      return this.createServerInstance();
    }.bind(this))
    .then(function(server) {
      return require('./authentication').init(server);
    })
    .then(function() {
      return this.registerAllRoutes();
    }.bind(this))
    .then(function() {
      return this.listen(3200); // TODO: Pop this in a config file
    }.bind(this));
  },

  /* The purpose of this application is to
     demonstrate authentication, not sign ups, 
     so a fake client and user is created */
  seedDatabase: function() {
    var User = models.User;
    var Client = models.Client;

    return Client
    .find()
    .exec()
    .then(function(clients) {
      if (clients.length > 0) {
        return clients; 
      } else {
        return new Promise(function(resolve, reject) {
          var mockUser = new User({
            email: "test@test.com",
            password: "password", // Don't do this is production, obviously!
            name: "Homer Simpson"
          });

          var mockClient = new Client({
            secret: hat(),
            name: "AuthApp",
            redirectUri: "http://localhost:4200" // TODO: Config this
          });

          mockUser.save(function(err, item) {
            if (err) {
              reject(err);
            } else {
              mockClient.save(function(err, item) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            }
          });
        }.bind(this));
      }
    }.bind(this));
  },

  createServerInstance: function() {
    this.server = express();
    this.server.use(cors());
    this.server.use(bodyParser.urlencoded({ extended: false }));
    this.server.use(bodyParser.json());
    return this.server;
  },

  registerAllRoutes: function() {
    console.log(chalk.green("Registering routes ✓"));
    
    var server = this.server;

    return new Promise(function(resolve, reject) {
      var versions = require('./routes/api');
      for (var version in versions) {
        versions[version].registerRoutes(server);
      }
      resolve();
    });
  },

  listen: function(port) {
    console.log(chalk.green("listening on port: " + port));
    return this.server.listen(port);
  }
};

module.exports = AuthApp;