/**
 * AjaxClient
 * Simple XMLHttpRequest client.
 * Now supported 'post' method,dataType 'json'
 */
export default class AjaxClient {

  constructor() {
  }

  getAsync(m) {

    m.type = 'get';
    this.ajax(m);
  }

  postAsync(m) {
    m.type = 'post';
    this.ajax(m);
  }

  ajax(m) {
    //use XMLHttpRequest2 style
    const xhr = new XMLHttpRequest();

    if (!m.url) {
      throw Error('Please specify url.');
    }


    //use async mode
    const ASYNC = true;

    if (m.type === 'post') {
      xhr.open('POST', m.url, ASYNC);
    } else if (m.type === 'get') {
      xhr.open('GET', m.url, ASYNC);
    } else {
      throw Error(`type:${m.type} is not supported`);
    }


    //Supported only 'json' method by now.
    if (m.dataType && m.dataType === 'json') {
      xhr.responseType = 'text';
    } else if (m.dataType && m.dataType === 'text') {
      xhr.responseType = 'text';
    } else {
      throw Error(`Please check dataType:${m.dataType}. "json" or "text"  is supported as dataType now.`);
    }
    if (m.contentType) {
      try {
        xhr.setRequestHeader('Content-Type', m.contentType);
      } catch (e) {
        throw Error(`Invalid content type ${m.contentType}`);
      }

    } else {
      throw Error('Please specify contentType.');
    }

    //Original headers
    if (m.headers) {
      for (const key in m.headers) {
        const value = m.headers[key];
        xhr.setRequestHeader(key, value);
      }
    }

    if (m.timeoutMillis) {
      xhr.timeout = m.timeoutMillis;
    }


    xhr.onload = evt => {

      if (xhr.status == 200) {

        let data = '';
        if (m.dataType == 'json') {

          data = JSON.parse(xhr.response);

        } else {
          data = xhr.response;
        }
        if (m.success) {
          m.success(data, xhr);
        }
      } else {

        //console.error("error:" + xhr.statusText);
        if (m.error) {
          m.error(evt, xhr);
        }
      }

    };


    if (m.timeout) {
      xhr.ontimeout = (e) => {
        m.timeout(e, xhr);
      };
    }

    if (m.error) {
      xhr.onerror = (e) => {
        m.error(e, xhr);
      }
    }

    if (m.type === 'post') {
      if (m.data) {
        xhr.send(m.data);
      } else {
        throw Error('.data is not specified.data must be specified on "POST" mode.');
      }

    } else if (m.type === 'get') {
      xhr.send(null);
    } else {
    }
  }
}
