/**
 * AjaxClient
 * Simple XMLHttpRequest client.
 * Now supported 'post' method,dataType 'json'
 */
export class AjaxClient {

  constructor() {
  }

  getAsync(options) {

    options.type = 'get';
    this.ajax(options);
  }

  postAsync(options) {
    options.type = 'post';
    this.ajax(options);
  }

  async get(options) {
    options.type = 'get';

    if (options.contentType === 'application/json') {
      if (this.typeOf(options.data) === 'String') {

      } else {
        const obj = options.data;
        options.data = JSON.stringify(obj);
      }
    }

    return new Promise((resolve) => {
      options.success = (data,xhr) => {
        resolve({ success: true, data: data,response:xhr });
      };
      options.error = (e,xhr) => {
        resolve({
          success: false,
          cause: 'error',
          error: e,
          response:xhr,
        });
      };
      options.timeout = (e) => {
        resolve({
          success: false,
          cause: 'timeout',
          error: e,
          response:null,
        });
      };
      this.ajax(options);
    });

  }

  async post(options) {
    options.type = 'post';

    if (options.contentType === 'application/json') {
      if (this.typeOf(options.data) === 'String') {

      } else {
        const obj = options.data;
        options.data = JSON.stringify(obj);
      }
    }

    return new Promise((resolve) => {
      options.success = (response) => {
        resolve({
          success: true,
          data: response
        });
      };
      options.error = (e) => {
        resolve({
          success: false,
          cause: 'error',
          error: e,
        });
      };
      options.timeout = (e) => {
        resolve({
          success: false,
          cause: 'timeout',
          error: e,
        });
      };
      this.ajax(options);
    });


  }

  ajax(options) {
    //use XMLHttpRequest2 style
    const xhr = new XMLHttpRequest();

    if (!options) {
      throw Error('Please specify options like #ajax(options)');
    }
    if (!options.url) {
      throw Error('Please specify url.');
    }


    //use async mode
    const ASYNC = true;

    if (options.type && options.type.toLowerCase() === 'post') {
      xhr.open('POST', options.url, ASYNC);
    } else if (options.type && options.type.toLowerCase() === 'get') {
      xhr.open('GET', options.url, ASYNC);
    } else {
      throw Error(`type:${options.type} is not supported`);
    }


    //Supported only 'json' method by now.
    if (options.dataType && options.dataType === 'json') {
      xhr.responseType = 'text';
    } else if (options.dataType && options.dataType === 'text') {
      xhr.responseType = 'text';
    } else {
      throw Error(`Please check dataType:${options.dataType}. "json" or "text"  is supported as dataType now.`);
    }

    if (options.contentType) {
      try {
        xhr.setRequestHeader('Content-Type', options.contentType);
      } catch (e) {
        throw Error(`Invalid content type ${options.contentType}`);
      }

    } else {
      if (options.type && options.type.toLowerCase() === 'post' || options.type && options.type.toLowerCase() === 'put') {
        throw Error('Please specify contentType.');
      }
    }


    //Original headers
    if (options.headers) {
      for (const key in options.headers) {
        const value = options.headers[key];
        xhr.setRequestHeader(key, value);
      }
    }

    // todo add support "xhrFields" for ajaxclient2(using FETCH API)
    // Note:in fetch API
    // fetch(url, {
    //   mode: 'cors', // instead of "crossDomain: true" in jQuery
    //   credentials: 'include' // with credentials
    // })
    // Note:in jQuery API
    // $.ajax({
    //   url: "some",
    // crossDomain: true,
    //   xhrFields: {
    //     withCredentials: true
    //   }
    // Note:in XHR
    // xhr.withCredentials = true;
    if (options.xhrFields) { // options.crossDomain  is not mandatory on XHR
      const { xhrFields } = options;
      if (xhrFields.withCredentials === true) {
        xhr.withCredentials = true;
      }
    }

    if (options.timeoutMillis) {
      xhr.timeout = options.timeoutMillis;
    }

    xhr.onload = evt => {

      if (xhr.status == 200) {

        let data = '';
        if (options.dataType == 'json') {

          data = JSON.parse(xhr.response);

        } else {
          data = xhr.response;
        }
        if (options.success) {
          options.success(data, xhr);
        }
      } else {

        //console.error("error:" + xhr.statusText);
        if (options.error) {
          options.error(evt, xhr);
        }
      }
    };

    if (options.timeout) {
      xhr.ontimeout = (e) => {
        options.timeout(e, xhr);
      };
    }

    if (options.error) {
      xhr.onerror = (e) => {
        options.error(e, xhr);
      }
    }

    if (options.type && options.type.toLowerCase() === 'post') {
      if (options.data) {
        if (options.contentType.startsWith('application/x-www-form-urlencoded')) {
          const fnEncodeForm = (formData) => {
            const params = [];
            for (const name in formData) {
              const value = formData[name];
              const param = encodeURIComponent(name) + '=' + encodeURIComponent(value);
              params.push(param);
            }
            return params.join('&').replace(/%20/g, '+');// encoded space(=%20) to '+'
          };

          const formData = fnEncodeForm(options.data);
          xhr.send(formData);
        } else {
          xhr.send(options.data);
        }
      } else {
        throw Error('.data is not specified.data must be specified on "POST" mode.');
      }

    } else if (options.type && options.type.toLowerCase() === 'get') {
      xhr.send(null);
    } else {
    }
  }

  typeOf(obj) {
    return Object.prototype.toString.call(obj)
      .slice(8, -1);
  }
}
