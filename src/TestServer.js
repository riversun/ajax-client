/**
 * Test Server for ajax-client
 *
 * npm run test-server
 *
 * @type {createApplication}
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//Specify port
var port = process.env.PORT || 9999;

//Allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type,Accept,X-Original-Header1,X-Original-Header2");
    next();
});

//Handle 'post' as 'http://localhost:9999/api'
app.post('/api', bodyParser.json(), function (req, res, next) {

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
app.listen(port);
console.log('Server started on port:' + port);