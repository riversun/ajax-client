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

  ajax(options) {
    //use XMLHttpRequest2 style
    const xhr = new XMLHttpRequest();

    if (!options.url) {
      throw Error('Please specify url.');
    }


    //use async mode
    const ASYNC = true;

    if (options.type === 'post') {
      xhr.open('POST', options.url, ASYNC);
    } else if (options.type === 'get') {
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
      throw Error('Please specify contentType.');
    }

    //Original headers
    if (options.headers) {
      for (const key in options.headers) {
        const value = options.headers[key];
        xhr.setRequestHeader(key, value);
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

    if (options.type === 'post') {
      if (options.data) {
        xhr.send(options.data);
      } else {
        throw Error('.data is not specified.data must be specified on "POST" mode.');
      }

    } else if (options.type === 'get') {
      xhr.send(null);
    } else {
    }
  }
}
