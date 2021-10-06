const Server = require('../test-util/TestServer.js');
const { AjaxClient } = require('../src/AjaxClient.js');
let server;

function getRandomPort() {
  return 40000 + Math.floor(Math.random() * Math.floor(1000));
}

const serverPort = getRandomPort();

beforeAll(() => {

  server = new Server(serverPort);
  console.log("Before all: start server.");
});

afterAll(() => {
  console.log("After all: close server.");
  server.close();
});

describe('AjaxClient', () => {

  describe('ajax()', () => {

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
      expect(resultOf2ndAccess.data['req-cookies-copy']['test-name1']).toBe('test-value1');


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
      //console.log(resultOf3rdAccess)

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
      expect(resultOf2ndAccess.data['req-cookies-copy']['test-name2']).toBe('test-value2');

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
    test('timeout', (done) => {

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
          throw Error('Timeout not fired');
        },
        error: (e, xhr) => {
          throw Error('Timeout not fired');
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

    // Content-Type is not needed for GET request
    // test('Illegal content-type to error', () => {
    //
    //   const client = new AjaxClient();
    //
    //   expect(function() {
    //     client.ajax({
    //       type: 'get',
    //       url: `http://localhost:${serverPort}/test.html`,
    //       //contentType: 'application/json; charset = UTF8',
    //       dataType: 'text',
    //     });
    //   }).toThrow('Invalid content type');
    //
    // });//test

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
          type: 'option',
          contentType: 'application/json',//content-type of sending data
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
        success: (data, xhr) => {
          expect(data).toContain('Test HTML');
          expect(xhr.status).toBe(200);
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
