var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var Promise = require('bluebird');
var chalk = require('chalk');

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

  },

  createServerInstance: function() {
    this.server = express();
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