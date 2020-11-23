const { URLSearchParams } = require("url");

/**
 * AjaxClient2
 * ajax2 with fetch api
 * MIT License
 *
 * @author Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)
 */
export class AjaxClient2 {

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
      options.success = (response) => {
        resolve({ success: true, data: response });
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

    const url = this._createUrl(options);
    const method = options.type;
    const dataType = options.dataType;
    const data = options.data;
    const headers = options.headers;
    const contentType = options.contentType;


    let postBody = null;

    if (!url) {
      throw Error('Please specify url.');
    }
    if (method && method.toLowerCase() === 'post') {

      postBody = data;//JSON.stringify(data);

      if (dataType === 'jsonp') {
        //POST and jsonp specified
        throw new Error(`type:'POST' and 'dataType:jsonp' are specified together.
                'POST' and 'jsonp' can not be specified together`);
      }
    }

    if (headers && dataType === 'jsonp') {
      //http-headers and jsonp specified
      throw new Error(`'headers' and 'dataType:jsonp' can not be specified together.
           Http headers cannot be sent when using jsonp.`);
    }

    const reqParam = {
      url: url,
      method: method,
      body: postBody,
      contentType: contentType,
    };

    if (headers) {
      reqParam.headers = headers;
    }

    if (dataType === 'json' || dataType === 'text') {
      return this._handleData(reqParam, dataType, options);
    } else if (dataType === 'jsonp') {
      return this._handleJsonp(reqParam, options);
    } else {
      throw new Error(`Please check dataType:${dataType} dataType must be 'json' or 'jsonp'`);
    }
  }

  _getFetchParam(reqParam, options) {


    const fetchParam = {
      method: reqParam.method.toUpperCase(),
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        //'Accept': 'application/json',
        //'Content-Type': 'application/json'
      }
      //credentials:null,// 'include',
      //referrer: 'no-referrer',
    };

    if (reqParam.contentType) {
      fetchParam.headers['Content-Type'] = reqParam.contentType;

    } else {
      throw Error('Please specify contentType.');
    }

    if (options.xhrFields) {
      const { xhrFields } = options;
      if (xhrFields.withCredentials === true) {
        fetchParam.credentials = 'include';
      }
    }
    //populate credentials
    if (reqParam.credentials) {
      fetchParam.credentials = reqParam.credentials;
    }

    //populate headers
    if (reqParam.headers) {
      for (const key in reqParam.headers) {
        const value = reqParam.headers[key];
        fetchParam.headers[key] = value;
      }
    }

    //populate body
    if (reqParam.body) {

      if (reqParam.contentType === 'application/x-www-form-urlencoded') {
        const fnCreateURLSearchParams = (formData) => {
          const urlSearchParams = new URLSearchParams();
          for (const paramName of Object.keys(formData)) {
            urlSearchParams.append(paramName, formData[paramName])
          }
          return urlSearchParams;
        };
        const formData = reqParam.body;
        const paramsFromFormData = fnCreateURLSearchParams(formData);
        fetchParam.body = paramsFromFormData;
      } else {
        fetchParam.body = reqParam.body;
      }


    }
    return fetchParam;
  }

  _handleData(reqParam, dataType, options) {
    const asyncResult = new AjaxResult();
    const fetchParam = this._getFetchParam(reqParam, options);

    const fetchPromise = fetch(reqParam.url, fetchParam);

    const timeout = (promise, options) => {
      return new Promise((resolve, reject) => {

        //タイムアウトのsetTimeと
        if (options && options.timeoutMillis) {
          setTimeout(() => {
            reject('timeout');
          }, options.timeoutMillis);
        }

        //fetchPromiseを同時実行
        promise.then((response) => {

          if (!response.ok) {
            const errorObj = response.statusText;
            //return Promise.reject({ data: errorObj, response });
            reject({ data: errorObj, response });
          }
          if (dataType === 'json') {

            response.json().then((jsonData) => {
              resolve({ data: jsonData, response });
              //return Promise.resolve({ data: jsonData, response });
              // return {data:jsonData,response}; // is also ok
            });
          }
          if (dataType === 'text') {
            response.text().then((jsonData) => {
              //return Promise.resolve({ data: jsonData, response });
              resolve({ data: jsonData, response });
              // return {data:jsonData,response}; // is also ok
            });
          }
        }).catch((err) => {
          reject(err);
        });
      });
    };

    timeout(fetchPromise, options)
      .then(
        (result) => {
          asyncResult._success(result.data);
          if (options && options.success) {
            options.success(result.data, result.response);//data.data);
          }
        })
      .catch(err => {
        const errorObj = err;
        asyncResult._fail(errorObj);

        if (err === 'timeout') {

          if (options && options.timeout) {
            options.timeout();
          }
        } else {
          if (options && options.error) {
            options.error(err, err.response);
          }
        }
      });


    return asyncResult;

  }

  _handleJsonp(reqParam, options) {

    const asyncResult = new AjaxResult();
    const scriptEle = document.createElement('script');
    const callbackFuncName = `ajaxclient2_${this._createUUID()}`;

    let src = reqParam.url;
    if (src.indexOf('?') >= 0) {
      src += `&callback=${callbackFuncName}`;
    } else {
      src += `?callback=${callbackFuncName}`;
    }
    scriptEle.src = src;
    scriptEle.addEventListener('error', (errorObj) => {
      asyncResult._fail(errorObj);
      if (options && options.error) {
        options.error(errorObj, null);
      }
    });

    //global object
    window[callbackFuncName] = (res) => {
      delete window[callbackFuncName];
      asyncResult._success(res);
      if (options && options.success) {
        options.success(res, null);
      }
    };

    const parentEle = document.getElementsByTagName('head') ? document.getElementsByTagName('head')[0] : document.body;
    parentEle.appendChild(scriptEle);
    return asyncResult;

  }

  _createUrl(options) {

    if (options.type && options.type.toLowerCase() === 'post') {
      //POST
      return options.url;
    } else if (options.type && options.type.toLowerCase() === 'get') {
      //GET
      let url = options.url;
      if (options.data) {

        const paramData = JSON.parse(options.data);

        url = url + '?';
        for (let paramKey of Object.keys(paramData)) {
          const paramVal = paramData[paramKey];
          url += `${paramKey}=${paramVal}&`;
        }
        url = url.substring(0, url.length - 1);
      }
      return url;
    } else {
      throw Error(`Invalid type ${options.type} is not supported`);
    }
  }

  _createUUID() {
    const dateTime = new Date().getTime();
    const uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dateTime + Math.random() * 16) % 16 | 0;
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  typeOf(obj) {
    return Object.prototype.toString.call(obj)
      .slice(8, -1);
  }
}

class AjaxResult {

  constructor() {


    this._successFunc = () => {
    };
    this._failFunc = () => {
    };
  }

  done(callbackFunc) {
    this._successFunc = callbackFunc;
    return this;
  }

  fail(callbackFunc) {
    this._failFunc = callbackFunc;
    return this;
  }

  _success(response) {
    if (this._successFunc) {
      this._successFunc(response);
    }

  }

  _fail(response) {
    if (this._failFunc) {
      this._failFunc(response);
    }
  }

}
