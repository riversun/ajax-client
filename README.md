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

and write followings in your code


- AjaxClient is based on the XmlHttpRequest2 and HAS APIs most similar to jQuery's API

```javascript
import {AjaxClient} from 'ajax-client'
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
  // crossDomain: true,
  // xhrFields: {
  //   withCredentials: true,
  // },
  success: (response, xhr) => {
  },
  error: (e, xhr) => {

  },
  timeout: (e, xhr) => {

  }
});
```


- AjaxClient2(**recommended**) is base on **fetch API**

```javascript
import {AjaxClient2 as AjaxClient} from 'ajax-client'
```

```javascript
import ajax_client from 'ajax-client';
const { AjaxClient2 } = ajax_client;

```


- use from CDN

```
<script src="https://cdn.jsdelivr.net/npm/ajax-client@2.0.2/lib/ajax-client.min.js"></script>
```

## usage

### Post

- Post JSON string to server,Receive JSON string from server.

```javascript

       const client = new AjaxClient2();
 
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
         // crossDomain: true,
         // xhrFields: {
         //   withCredentials: true,
         // },
         success: (data, response) => {
           // response is fetch response
         },
         error: (data,response,cause,err) => {
         },
         timeout: (data,response,cause,err) => {
         }
       });

```

- Post form data

```javascript
     const client = new AjaxClient2();
     const data = {
        message: "hello"
      }

      // first access = Receive cookies with the intention of credential
      client.ajax({
        type: 'post',
        url: `http://localhost:${serverPort}/form`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/x-www-form-urlencoded',
        data,
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
         // crossDomain: true,
         // xhrFields: {
         //   withCredentials: true,
         // },
        success: (data, response) => {
          // response is fetch response
        },
        error: (data,response,cause,err) => {
        },
        timeout: (data,response,cause,err) => {
        }
      });
```

### Post with done/fail

```javascript
 client.ajax({
        type: 'post',
        url: 'http://localhost:9999/api',
        //contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
      }).done((data,response) => {
        console.log(data);
        console.log(response.status);
      }).fail((data,response,cause,err) => {
        console.log(data);
        console.log(response.status);
      });
```

### Post with Async/Await

```javascript
const client = new AjaxClient2();  
const result = await client.post({
        url: 'http://localhost:9999/api',
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json',//content-type of sending data
        data: data,
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
      });
```

```js
console.log(result.success); // true if success
console.log(result.data);// get JSON-parsed data
console.log(result.response.status);// get status code 200
```

#### Success Response 

```javascript
{
success: true,
data:{ },// response payload from server
response:{}, // get raw fetch response.You can get response.status,response.statusText etc.  
}
```

#### Error Response 


- server error

Occurs when the server side returns a status code other than 200-299.
Parse the error object yourself if you want to determine more details.

```javascript
{
success: false;
data:{ },// response payload from server
cause:'server error,statusCode:404',
error:e,// error object
response:{}, // get raw fetch response.You can get response.status,response.statusText etc.  
}
```

- client error

When you specify json as the expected data type, but the server returns text, etc.
Parse the error object yourself if you want to determine more details.

```javascript
{
success: false;
data:{ },// response payload from server
cause:'client error,${error_message_thrown_at_client}',
error:e,// error object
response:{}, // get raw fetch response.You can get response.status,response.statusText etc.
}
```

- network error

Occurs when the network is disconnected or the server cannot be found.
Parse the error object yourself if you want to determine more details.

```javascript
{
success: false;
data:null,
cause:'network error',
error:e,// error object
response:null,  // no server response
}
```


- timeout error

- Occurs when no reply is received from the server for more than the specified timeout milliseconds.

```javascript
{
  success: false;
  data:null,
  cause:'timeout,100ms elapsed',
    error:e,// error object
    response:null,
}
```


### Get

```javascript
     const client = new AjaxClient2();

      client.ajax({
        type: 'get',
        url: 'http://localhost:9999/something.html',
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        success: (data, response) => {
          // response is fetch response
        },
        error: (data,response,cause,err) => {
        },
        timeout: (data,response,cause,err) => {
        }
      });
```

```js
console.log(result.success); // true if success
console.log(result.data);// get JSON-parsed data
console.log(result.response.status);// get status code 200
```


### Get with Async/Await

```javascript
const client = new AjaxClient2();  
const result = await client.get({
        url: 'http://localhost:9999/api',
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
      });
```

#### Success Response 

```javascript
{
success: true,
data:{ },// response payload from server
response:{}, // get raw response.You can get response.status,response.statusText etc.  

}
```

#### Error Response 

- server error
 
```javascript
{
success: false;
cause:'error',// 'error' or 'timeout'
error:e,// error object
response:{}, // get raw response.You can get response.status,response.statusText etc.  
}
```

- timeout error

```javascript
{
success: false;
cause:'timeout',// 'error' or 'timeout'
error:e,// error object
response:null,  
}
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
    const ajax = new AjaxClient2();

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

### Run on node.js (ES6 -)


If you set up `node-fetch` externally, you can use AjaxClient with node.js.

```javascript
import fetch from 'node-fetch';
import ajax_client from 'ajax-client';
const { AjaxClient2 } = ajax_client;
const ajax = new AjaxClient2({ fetch });
```


### Run on node.js (commonJS/babel)

If you set up `node-fetch` externally, you can use AjaxClient with node.js.

```javascript
import fetch from 'node-fetch';
import { AjaxClient2 as AjaxClient } from 'ajax-client';
const ajax = new AjaxClient({ fetch });
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
