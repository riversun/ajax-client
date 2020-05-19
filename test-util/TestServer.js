/**
 * Test Server for ajax-client
 *
 * npm run test-server
 *
 * @type {createApplication}
 */

const server = {

  // Example class constructor definition
  //Edit Class Name
  TestServer: function() {
    var me = this;


    const express = require('express');
    this.app = express();


    const bodyParser = require('body-parser');

    this.app.use(bodyParser.json());
    var port = process.env.PORT || 9999;

    //Allow CORS
    this.app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Accept,X-Original-Header1,X-Original-Header2");
      next();
    });

    this.app.use(express.static(__dirname));

    //Handle 'post' as 'http://localhost:9999/api'
    this.app.post('/api', bodyParser.json(), function(req, res, next) {

      res.status(200);

      const data = req.body;
      if (data) {
        let message = "Hi,there! You say " + data.message;
        res.json({
          output: message,
        });
      } else {
        let message = 'error:message not found.';
        res.json({
          error: message
        });
      }


    });

    this.app.get('/api', bodyParser.json(), function(req, res, next) {

      res.status(200);

      const data = req.body;
      if (data) {
        let message = "Hi,there! You say " + data.message;
        res.json({
          output: message
        });
      } else {
        let message = 'error:message not found.';
        res.json({
          error: message
        });
      }


    });

    this.app.get('/timeout', bodyParser.json(), function(req, res, next) {

      res.status(200);


      setTimeout(() => {
        res.json({
          output: 'Hi! This is time out api.',
        });
      }, 3000);

    });
    this.server = this.app.listen(port);
    console.log('Server started on port:' + port);
  }
};

//Add methods to the class
server.TestServer.prototype = {
  close: function() {
    console.log("Server closed");
    this.server.close();
  }

};


module.exports = server.TestServer;