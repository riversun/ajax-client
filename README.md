# ajax-client
[![npm version](https://badge.fury.io/js/ajax-client.svg)](https://badge.fury.io/js/ajax-client)
[![CircleCI](https://circleci.com/gh/riversun/ajax-client/tree/master.svg?style=shield)](https://circleci.com/gh/riversun/ajax-client/tree/master)
[![codecov](https://codecov.io/gh/riversun/ajax-client/branch/master/graph/badge.svg)](https://codecov.io/gh/riversun/ajax-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple ajax client with jQuery like ajax API for js.

jQuery is great, but do you use jQuery(80KB over) only for ajax?


## install

- use package with npm

```shell
npm install ajax-client 
```

- use from CDN

```
<script src="https://cdn.jsdelivr.net/npm/ajax-client@1.2.0/lib/ajax-client.js"></script>
```

## usage

### Post

- Post JSON string to server,Receive JSON string from server.

```javascript

       const client = new AjaxClient();
 
       //Data object to send
       const data = {
         message: "hello"
       }
 
       client.ajax({
         type: 'post',
         url: 'http://localhost:9999/api',
         headers: {
           'X-Original-Header1': 'header-value-1',//Additional Headers
           'X-Original-Header2': 'header-value-2',
         },
         contentType: 'application/json',//content-type of sending data
         data: JSON.stringify(data),//text data
         dataType: 'json',//data type to parse when receiving response from server
         timeoutMillis: 5000,//timeout milli-seconds
 
         success: (response, xhr) => {
         },
         error: (e, xhr) => {
 
         },
         timeout: (e, xhr) => {
 
         }
       });

```

### Get

```javascript
     const client = new AjaxClient();

      client.ajax({
        type: 'get',
        url: 'http://localhost:9999/something.html',
        contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        success: (response, xhr) => {
        },
        error: (e, xhr) => {
        },
        timeout: (e, xhr) => {
        }
      });
```

## Example (using ajax-client)

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ajax-client example</title>
</head>
<body>
<script src="https://raw.githubusercontent.com/riversun/ajax-client/master/dist/ajaxclient.js"></script>
<script>
    const ajax = new AjaxClient();

    //Data object to send
    const data = {
        message: "hello"
    }

    //Do async post request
    ajax.postAsync({
        url: 'http://localhost:9999/api',//Endpoint
        headers: {
            'X-Original-Header1': 'header-value-1',//Additional Headers
            'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json; charset = UTF-8',//content-type of sending data
        data: JSON.stringify(data),//text data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        success: response => {
            console.log(response);
        },
        error: e => {
            console.error('Error occurred');
        },
        timeout: e => {
            console.error('Timeout occurred.');
        }
    });

</script>
</body>
</html>


```

### Run test server (node.js)

- run test-server to test example above

**TestServer.js**

```shell
npm run test-server
```

```javascript

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
```

<hr>

## Classical approach(using jQuery)

**index_jquery.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery ajax example</title>
</head>
<body>

<script
        src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
        crossorigin="anonymous"></script>

<script>

    //Data object to send
    const data = {
        message: "hello"
    }

    $.ajax({
        type: "post",
        url: 'http://localhost:9999/api',//Endpoint
        headers: {
            'X-Original-Header1': 'header-value-1',//Additional Headers
            'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json; charset = UTF-8',//content-type of sending data
        data: JSON.stringify(data),
        dataType: "json",
        success: response => {
            console.log(response);
        },
        error: e => {
            console.error('Error occurred');
        }
    });

</script>
</body>
</html>

```