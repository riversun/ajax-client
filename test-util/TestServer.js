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
  TestServer: function(originalPort) {
    var me = this;

    const cookieParser = require('cookie-parser');
    const express = require('express');
    this.app = express();


    const bodyParser = require('body-parser');
    this.app.use(cookieParser())
    this.app.use(bodyParser.json());
    let port = process.env.PORT || 9999;
    if (originalPort) {
      port = originalPort;
    }

    //Allow CORS
    this.app.use(function(req, res, next) {
      //res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Accept,X-Original-Header1,X-Original-Header2");
      res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Credentials', true);
      // res.header('Access-Control-Max-Age', '86400');
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
    this.app.post('/api-error', bodyParser.json(), function(req, res, next) {
      res.status(500);
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
    this.app.post('/api-auth', bodyParser.json(), function(req, res, next) {
      res.status(200);
      const data = req.body;
      if (data) {

        res.cookie('test-name1', 'test-value1', {
          maxAge: 60000,
          httpOnly: false,// true:cannot access from JS
          secure: false,// true:can only send via HTTPS
        });

        let message = "Hi,there! You say " + data.message;
        res.json({
          output: message,
          'req-cookies-copy': req.cookies,
        });
      } else {
        let message = 'error:message not found.';
        res.json({
          error: message
        });
      }
    });
    this.app.post('/form', bodyParser.urlencoded({ extended: true }), function(req, res, next) {
      res.status(200);

      const data = req.body;


      if (data) {

        res.cookie('test-name2', 'test-value2', {
          maxAge: 60000,
          httpOnly: false,// true:cannot access from JS
          secure: false,// true:can only send via HTTPS
        });

        let message = "Hi,there! You say " + data.message;
        res.json({
          output: message,
          'req-cookies-copy': req.cookies,
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

      const query = req.query;
      const data = req.body;
      const callback = query.callback;
      let message = "Hi,there! You say " + query.message;
      let jsonObj = {
        output: message
      };

      if (data) {
        if (callback) {
          //jsonp
          res.header('Content-Type', 'text/javascript;charset=utf-8');
          const responseText = callback + '(' + JSON.stringify(jsonObj) + ')';
          res.end(responseText);
        } else {
          //ajax
          res.json(jsonObj);
        }
      } else {
        let message = 'error:message not found.';
        res.json({
          error: message
        });
      }
    });
    this.app.get('/text', bodyParser.json(), function(req, res, next) {

      res.status(200);

      res.end("example text response");

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
