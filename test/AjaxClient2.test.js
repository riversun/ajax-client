const Server = require('../test-util/TestServer.cjs');
const AjaxClient = require('../src/AjaxClient2.js').AjaxClient2;
let server;

const fetch = require('node-fetch');
window.fetch = fetch;

function getRandomPort() {
  return 40000 + Math.floor(Math.random() * Math.floor(1000));
}

let serverPort = getRandomPort();

beforeAll(() => {

  server = new Server(serverPort);
  console.log(`Before all: start server on port:${serverPort}`);
});

afterAll(() => {
  console.log("After all: close server.");
  server.close();
});


describe('AjaxClient', () => {

  describe('ajax()', () => {

    test('Method "get" and receive "done"', (done) => {

      const client = new AjaxClient();
      const data = {
        message: "hello"
      }
      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/api`,
        // contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
      }).done((result) => {
        try {
          console.log(result)
          expect(result.output).toContain('Hi,there! You say hello');
          done();
        } catch (error) {
          done(error);
        }
      });

    });
    test('Method "post" and receive "done"', (done) => {

      const client = new AjaxClient();
      const data = {
        message: "hello"
      }
      client.ajax({
        type: 'post',
        url: `http://localhost:${serverPort}/api`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
      }).done((result) => {
        try {
          expect(result.output).toContain('Hi,there! You say hello');
          done();
        } catch (error) {
          done(error);
        }
      });

    });
    test('Method "jsonp" and receive "done"', (done) => {

      const client = new AjaxClient();
      const data = {
        message: "hello"
      }
      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/api`,
        contentType: 'application/json',
        dataType: 'jsonp',
        data: JSON.stringify(data),
      }).done((result) => {
        try {
          console.log("debug", result);
          expect(result.output).toContain('Hi,there! You say hello');
          done();
        } catch (error) {
          done(error);
        }
      });

    });
    test('Method "get" and receive "fail" of status:404', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/test_nothing`,
        //contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
      }).done((data, response) => {
      }).fail((data, response, cause) => {
        console.log("response", response);
        expect(response.status).toBe(404);
        expect(cause).toBe("server error,statusCode:404");
        done();
      });

    });//test

    test('Method "get" and receive "fail" of network error', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'get',
        url: `http://localhost:12345`,
        //contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
      }).done((data, response) => {
      }).fail((data, response, cause, err) => {
        console.log("response", err);
        expect(cause).toBe("network error");
        done();
      });

    });//test

    test('Method "get" text and receive "fail" of JSON format error.', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/text`,
        //contentType: 'application/json',//content-type of sending data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
      }).done((data, response) => {
      }).fail((data, response, cause) => {
        console.log("cause", cause);
        expect(cause).toContain('invalid json response');
        done();
      });

    });//test
    test('"post"', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'post',
        url: `http://localhost:${serverPort}/api`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json',//content-type of sending data
        data: JSON.stringify(data),//text data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds

        success: (data, response) => {
          try {
            expect(JSON.stringify(data)).toBe(JSON.stringify({ output: 'Hi,there! You say hello' }));
            done();
          } catch (error) {
            done(error);
          }
        },
        error: (data, response, cause, err) => {

        },
        timeout: (data, response, cause, err) => {

        }
      });

    });//test
    test('"post" and fail', async (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      if (false)
        client.ajax({
          type: 'post',
          url: `http://localhost:${serverPort}/api-error`,
          headers: {
            'X-Original-Header1': 'header-value-1',//Additional Headers
            'X-Original-Header2': 'header-value-2',
          },
          contentType: 'application/json',//content-type of sending data
          data: JSON.stringify(data),//text data
          dataType: 'json',//data type to parse when receiving response from server
          timeoutMillis: 5000,//timeout milli-seconds

          success: (data, response) => {
            try {
              expect(JSON.stringify(data)).toBe(JSON.stringify({ output: 'Hi,there! You say hello' }));
              done();
            } catch (error) {
              done(error);
            }
          },
          error: (data, response) => {
            console.log("dddd", data, response)
          },
          timeout: (e, xhr) => {

          }
        });


      // first access = Receive cookies with the intention of credential
      const result = await client.post({
        type: 'post',
        url: `http://localhost:${serverPort}/api-error`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/x-www-form-urlencoded',
        data: data,
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
      });
      console.log(result);
      done();

    });//test
    test('"post with cookie"', async () => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      // first access = Receive cookies with the intention of credential
      await client.post({
        type: 'post',
        url: `http://localhost:${serverPort}/api-auth`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json',//content-type of sending data
        data: JSON.stringify(data),//text data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
      });

      // second access = make sure that the credential (cookie) is sent without being aware of it
      const resultOf2ndAccess = await client.post({
        type: 'post',
        url: `http://localhost:${serverPort}/api-auth`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json',//content-type of sending data
        data: JSON.stringify(data),//text data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
      });

      expect(resultOf2ndAccess.success).toBe(true);

      // todo  node-fetch doesn't support credentials:'include'
      //expect(resultOf2ndAccess.data['req-cookies-copy']['test-name1']).toBe('test-value1');


      // third access = withCredentials:false to ensure that no cookie is sent
      const resultOf3rdAccess = await client.post({
        type: 'post',
        url: `http://localhost:${serverPort}/api-auth`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json',//content-type of sending data
        data: JSON.stringify(data),//text data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        crossDomain: true,
        xhrFields: {
          withCredentials: false,
        },
      });
      expect(resultOf3rdAccess.data['req-cookies-copy']).toStrictEqual({});


    });//test
    test('"post with application/x-www-form-urlencoded"', async () => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      // first access = Receive cookies with the intention of credential
      const result = await client.post({
        type: 'post',
        url: `http://localhost:${serverPort}/form`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/x-www-form-urlencoded',
        data: data,
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
      });
      // Verify that the posted as "application/x-www-form-urlencoded"  form data is interpreted on the server side
      expect(result.data.output).toBe(`Hi,there! You say hello`);//

      // second access = make sure that the credential (cookie) is sent without being aware of it
      const resultOf2ndAccess = await client.post({
        type: 'post',
        url: `http://localhost:${serverPort}/form`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/x-www-form-urlencoded',
        data: data,
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
      });

      expect(resultOf2ndAccess.success).toBe(true);
      // todo  node-fetch doesn't support credentials:'include'
      // expect(resultOf2ndAccess.data['req-cookies-copy']['test-name2']).toBe('test-value2');

      // third access = withCredentials:false to ensure that no cookie is sent
      const resultOf3rdAccess = await client.post({
        type: 'post',
        url: `http://localhost:${serverPort}/form`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/x-www-form-urlencoded',
        data: data,
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        crossDomain: true,
        xhrFields: {
          withCredentials: false,
        },
      });
      expect(resultOf3rdAccess.data['req-cookies-copy']).toStrictEqual({});
      expect(resultOf3rdAccess.response.status).toBe(200);


    });//test
    test('"POST"', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'POST',
        url: `http://localhost:${serverPort}/api`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json',//content-type of sending data
        data: JSON.stringify(data),//text data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds

        success: (response, xhr) => {
          expect(JSON.stringify(response)).toBe(JSON.stringify({ output: 'Hi,there! You say hello' }));
          done();
        },
        error: (e, xhr) => {

        },
        timeout: (e, xhr) => {

        }
      });

    });//test
    test('"post in text with async/await"', async () => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      const result = await client.post({
        type: 'post',
        url: `http://localhost:${serverPort}/api`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json',//content-type of sending data
        data: JSON.stringify(data),//text data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
      });
      expect(result.success).toBe(true);
      expect(JSON.stringify(result.data)).toBe(JSON.stringify({ output: 'Hi,there! You say hello' }));


    });//test
    test('"post object with async/await"', async () => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      const result = await client.post({
        type: 'post',
        url: `http://localhost:${serverPort}/api`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json',//content-type of sending data
        data: data,//text data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
      });
      expect(result.success).toBe(true);
      expect(JSON.stringify(result.data)).toBe(JSON.stringify({ output: 'Hi,there! You say hello' }));


    });//test


    test('check dataType', (done) => {

      const client = new AjaxClient();

      expect(function() {
        //Data object to send
        const data = {
          message: "hello"
        }

        client.ajax({
          type: 'post',
          url: `http://localhost:${serverPort}/api`,
          headers: {
            'X-Original-Header1': 'header-value-1',//Additional Headers
            'X-Original-Header2': 'header-value-2',
          },
          contentType: 'application/json',//content-type of sending data
          data: JSON.stringify(data),//text data
          dataType: 'xml',//data type to parse when receiving response from server
          timeoutMillis: 5000,//timeout milli-seconds

          success: (response, xhr) => {
          },
          error: (e, xhr) => {
          },
          timeout: (e, xhr) => {
          }
        });
      }).toThrow('Please check dataType');
      done();

    });//test
    test('"get"', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/test.html`,
        //contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        success: (response, xhr) => {
          expect(response).toContain('Test HTML');
          done();
        },
        error: (e, xhr) => {
          console.log('Error occurred' + xhr.status);
        },
        timeout: (e, xhr) => {
          console.error('Timeout occurred.' + e);
        }
      });

    });//test
    test('"GET"', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'GET',
        url: `http://localhost:${serverPort}/test.html`,
        //contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        success: (response, xhr) => {
          expect(response).toContain('Test HTML');
          done();
        },
        error: (e, xhr) => {
          console.log('Error occurred' + xhr.status);
        },
        timeout: (e, xhr) => {
          console.error('Timeout occurred.' + e);
        }
      });

    });//test
    test('"get" with async/await', async () => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      const result = await client.get({
        url: `http://localhost:${serverPort}/test.html`,
        contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
      });
      expect(result.success).toBe(true);
      expect(result.data).toContain('Test HTML');

    });//test

    test('"get" with parameters', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/api`,
        //contentType: 'application/json',//content-type of sending data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        data: JSON.stringify(data),
        success: (json, xhr) => {
          try {
            expect(json.output).toContain('Hi,there! You say hello');
            done();
          } catch (error) {
            done(error);
          }
        },
        error: (e, xhr) => {

          throw Error('Error occurred.(error)' + e);
        },
        timeout: (e, xhr) => {
          //throw Error('Error occurred.(timeout)' + e);
        }
      });

    });//test
    test('Status error 404', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/test_nothing`,
        //contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        success: (response, xhr) => {
          throw Error('404 Error should be occurred.');
        },
        error: (e, xhr) => {
          expect(xhr.status).toBe(404);
          done();
        },
        timeout: (e, xhr) => {
          throw Error('404 Error should be occurred.');
        }
      });

    });//test
    test('General error', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'get',
        url: 'http://localhost:1111/test.html',
        //contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        success: (response, xhr) => {
          throw Error('404 Error should be occurred.');
        },
        error: (e, xhr) => {
          done();
        },
        timeout: (e, xhr) => {
          throw Error('404 Error should be occurred.');
        }
      });

    });//test
    test('post with jsonp to error', () => {

      const client = new AjaxClient();

      expect(function() {
        client.ajax({
          type: 'post',
          url: `http://localhost:${serverPort}/test.html`,
          contentType: 'application/json',//content-type of sending data
          dataType: 'jsonp',//data type to parse when receiving response from server
          timeoutMillis: 5000,//timeout milli-seconds
          success: (response, xhr) => {
          },
        });
      }).toThrow("'POST' and 'jsonp' can not be specified together");

    });//test

    test('headers with jsonp to error', () => {

      const client = new AjaxClient();

      expect(function() {
        client.ajax({
          type: 'get',
          url: `http://localhost:${serverPort}/test.html`,
          headers: {
            'X-Original-Header1': 'header-value-1',//Additional Headers
            'X-Original-Header2': 'header-value-2',
          },
          //contentType: 'application/json',//content-type of sending data
          dataType: 'jsonp',//data type to parse when receiving response from server
          timeoutMillis: 5000,//timeout milli-seconds
          success: (response, xhr) => {
          },
        });
      }).toThrow("Http headers cannot be sent when using jsonp");

    });//test


    test('jsonp', (done) => {
      const client = new AjaxClient();

      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/api?message=hello2`,//Endpoint
        //contentType: 'application/json',//content-type of sending data
        dataType: 'jsonp',
        success: (json, xhr) => {
          try {
            expect(JSON.stringify(json)).toBe(JSON.stringify({ output: 'Hi,there! You say hello2' }));
            done();
          } catch (error) {
            done(error);
          }
        },
      });
    });//test

    test('jsonp with no query params', (done) => {
      const client = new AjaxClient();

      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/api`,//Endpoint
        //contentType: 'application/json',//content-type of sending data
        dataType: 'jsonp',
        success: (json, xhr) => {
          try {
            expect(json.output).toContain('Hi,there! You say');
            done();
          } catch (error) {
            done(error);
          }
        },
      });
    });//test

    test('jsonp with error', (done) => {
      const client = new AjaxClient();

      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/api_nothing`,//Endpoint
        //contentType: 'application/json',//content-type of sending data
        dataType: 'jsonp',
        success: (json, xhr) => {
          throw Error('Error must be occurred');
        },
        error: (err) => {
          done();
        }
      });
    });//test

    test.skip('timeout', (done) => {

      // timeout is successfully implemented but node-fetch has error.

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'get',
        url: `http://localhost:${serverPort}/timeout`,
        //contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 1000,//timeout milli-seconds
        success: (response, xhr) => {
          throw Error('Timeout not fired(success fired)');
        },
        error: (e, xhr) => {
          throw Error('Timeout not fired(error fired');
        },
        timeout: (e, xhr) => {
          done();
        }
      });

    });//test
    test('"option" to error', () => {

      const client = new AjaxClient();

      expect(function() {
        client.ajax({
          type: 'option',
          url: `http://localhost:${serverPort}/test.html`,
          contentType: 'application/json',//content-type of sending data
          dataType: 'text',//data type to parse when receiving response from server
          timeoutMillis: 5000,//timeout milli-seconds
          success: (response, xhr) => {
          },
        });
      }).toThrow('option is not supported');

    });//test

    test('Illegal content-type to error', () => {

      const client = new AjaxClient();

      // do not thrown on fetch
      // expect(function() {
      //   client.ajax({
      //     type: 'get',
      //     url: `http://localhost:${serverPort}/test.html`,
      //     contentType: 'application/json; charset = UTF8',
      //     dataType: 'text',
      //   });
      // }).toThrow('Invalid content type');

    });//test

    // Content-Type is not needed for GET request
    // test('No content-type to error', () => {
    //
    //   const client = new AjaxClient();
    //
    //   expect(function() {
    //     client.ajax({
    //       type: 'get',
    //       url: `http://localhost:${serverPort}/test.html`,
    //       dataType: 'text',
    //     });
    //   }).toThrow('Please specify contentType');
    //
    // });//test
    test('forget url', () => {

      const client = new AjaxClient();

      expect(function() {
        client.ajax({
          type: 'get',
          //contentType: 'application/json',//content-type of sending data
          dataType: 'text',//data type to parse when receiving response from server
          timeoutMillis: 5000,//timeout milli-seconds
          success: (response, xhr) => {
          },
        });
      }).toThrow('Please specify url.');

    });//test
  });//describe


  describe('postAsync()', () => {

    test('default', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.postAsync({
        url: `http://localhost:${serverPort}/api`,
        headers: {
          'X-Original-Header1': 'header-value-1',//Additional Headers
          'X-Original-Header2': 'header-value-2',
        },
        contentType: 'application/json',//content-type of sending data
        data: JSON.stringify(data),//text data
        dataType: 'json',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds

        success: (response, xhr) => {
          expect(JSON.stringify(response)).toBe(JSON.stringify({ output: 'Hi,there! You say hello' }));
          done();
        },
        error: (e, xhr) => {
        },
        timeout: (e, xhr) => {
        }
      });

    });//test


    test('No content-type to error while POST', () => {

      const client = new AjaxClient();


      //Data object to send
      const data = {
        message: "hello"
      }
      expect(function() {
        client.postAsync({
          url: `http://localhost:${serverPort}/api`,
          headers: {
            'X-Original-Header1': 'header-value-1',//Additional Headers
            'X-Original-Header2': 'header-value-2',
          },
          data: JSON.stringify(data),//text data
          dataType: 'json',//data type to parse when receiving response from server
          timeoutMillis: 5000,//timeout milli-seconds

          success: (response, xhr) => {
            expect(JSON.stringify(response)).toBe(JSON.stringify({ output: 'Hi,there! You say hello' }));
            done();
          },
          error: (e, xhr) => {
          },
          timeout: (e, xhr) => {
          }
        });
      }).toThrow('Please specify contentType');

    });//test
  });//describe


  describe('getAsync()', () => {

    test('default', (done) => {


      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.getAsync({

        url: `http://localhost:${serverPort}/test.html`,
        contentType: 'application/json',//content-type of sending data
        dataType: 'text',//data type to parse when receiving response from server
        timeoutMillis: 5000,//timeout milli-seconds
        success: (response, xhr) => {
          expect(response).toContain('Test HTML');
          done();
        },
        error: (e, xhr) => {
          console.log('Error occurred' + xhr.status);
        },
        timeout: (e, xhr) => {
          console.error('Timeout occurred.' + e);
        }
      });


    });
  });


});
