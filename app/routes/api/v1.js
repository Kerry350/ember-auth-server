var express = require('express');
var fs = require('fs');

module.exports = {
  registerRoutes: function(server) {
    var router = express.Router();
    
    var V1 = require('./v1-api');

    for (var key in V1) {
      V1[key].register(router);
    }

    server.use('/api/v1', router);
  }
}