const Server = require('../test-util/TestServer.js');
const AjaxClient = require('../src/AjaxClient.js').default;
let server;

beforeAll(() => {

  server = new Server();
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
          expect(JSON.stringify(response)).toBe(JSON.stringify({ output: 'Hi,there! You say hello' }));
          done();
        },
        error: (e, xhr) => {

        },
        timeout: (e, xhr) => {

        }
      });

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
          url: 'http://localhost:9999/api',
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
        url: 'http://localhost:9999/test.html',
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

    });//test
    test('Status error 404', (done) => {

      const client = new AjaxClient();

      //Data object to send
      const data = {
        message: "hello"
      }

      client.ajax({
        type: 'get',
        url: 'http://localhost:9999/test_nothing.html',
        contentType: 'application/json',//content-type of sending data
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
        contentType: 'application/json',//content-type of sending data
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
        url: 'http://localhost:9999/timeout',
        contentType: 'application/json',//content-type of sending data
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
          url: 'http://localhost:9999/test.html',
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

      expect(function() {
        client.ajax({
          type: 'get',
          url: 'http://localhost:9999/test.html',
          contentType: 'application/json; charset = UTF8',
          dataType: 'text',
        });
      }).toThrow('Invalid content type');

    });//test
    test('No content-type to error', () => {

      const client = new AjaxClient();

      expect(function() {
        client.ajax({
          type: 'get',
          url: 'http://localhost:9999/test.html',
          dataType: 'text',
        });
      }).toThrow('Please specify contentType');

    });//test
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
          expect(JSON.stringify(response)).toBe(JSON.stringify({ output: 'Hi,there! You say hello' }));
          done();
        },
        error: (e, xhr) => {
        },
        timeout: (e, xhr) => {
        }
      });

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

        url: 'http://localhost:9999/test.html',
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