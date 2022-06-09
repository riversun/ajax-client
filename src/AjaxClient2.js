
/**
 * AjaxClient2
 * ajax2 with fetch api
 * MIT License
 *
 * @author Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)
 */
export class AjaxClient2 {

  constructor(opt) {
    this.opt = opt || {};
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
      options.success = (data, response) => {
        resolve({ success: true, data: data, response });
      };
      options.error = (data, response, cause, err) => {
        resolve({
          success: false,
          data,
          cause: cause,
          error: err,
          response: response,
        });
      };
      options.timeout = (data, response, cause, err) => {
        resolve({
          success: false,
          data,
          cause: cause,
          error: err,
          response: response,
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
      options.success = (data, response) => {
        resolve({
          success: true,
          data: data,
          response,
        });
      };
      options.error = (data, response, cause, err) => {
        resolve({
          success: false,
          data,
          cause: cause,
          error: err,
          response: response,
        });
      };
      options.timeout = (data, response, cause, err) => {
        resolve({
          success: false,
          data,
          cause: cause,
          error: err,
          response: response,
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
      const asyncResult = this._handleData(reqParam, dataType, options);
      return asyncResult;
    } else if (dataType === 'jsonp') {
      const asyncResult = this._handleJsonp(reqParam, options);
      return asyncResult;
    } else {
      throw new Error(`Please check dataType:${dataType} dataType must be 'json' or 'jsonp'`);
    }
  }

  _getFetchParam(reqParam, options) {


    const method = reqParam.method.toUpperCase();
    const fetchParam = {
      method: method,
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
      if (method === 'POST' || method === 'PUT') {
        throw Error('Please specify contentType.');
      }
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

      if (reqParam.contentType.startsWith('application/x-www-form-urlencoded')) {

        const fnEncodeForm = (formData) => {
          const params = [];
          for (const name in formData) {
            const value = formData[name];
            const param = encodeURIComponent(name) + '=' + encodeURIComponent(value);
            params.push(param);
          }
          return params.join('&').replace(/%20/g, '+');// encoded space(=%20) to '+'
        };

        const formData = reqParam.body;
        const paramsFromFormData = fnEncodeForm(formData);
        fetchParam.body = paramsFromFormData;
      } else {
        fetchParam.body = reqParam.body;
      }


    }
    return fetchParam;
  }

  _handleData(reqParam, dataType, options) {
    const self = this;
    const asyncResult = new AjaxResult();
    const fetchParam = this._getFetchParam(reqParam, options);

    const fnFetch = self.opt.fetch || fetch;

    const fetchPromise = fnFetch(reqParam.url, fetchParam);

    const fnTimeout = (promise, options) => {

      return new Promise((resolve, reject) => {

        //(1)タイムアウトのsetTimeと (2) fetchPromiseを同時実行
        if (options && options.timeoutMillis) {
          // (1)
          setTimeout(() => {
            reject({ data: null, cause: `timeout,${options.timeoutMillis}ms elapsed`, response: null });
          }, options.timeoutMillis);
        }

        // (2)
        promise.then(
          (response) => {
            if (!response.ok) {
              // - !response.okの場合(status が 200-299 の範囲外の場合)
              if (dataType === 'json') {
                response.json()
                  .then((jsonData) => {
                    reject({ data: jsonData, cause: `server error,statusCode:${response.status}`, response });
                  })
                  .catch((err) => {
                    // json parse error の場合は text　でとりなおす
                    response.text()
                      .then((textData) => {
                        reject({ data: textData, cause: `server error,statusCode:${response.status}`, response });
                      })
                      .catch((err) => {
                        reject({ data: null, cause: `client error,${err}`, response });
                      });
                    // reject({ data: null, cause: `client error,${err}`, response });
                  });

              } else if (dataType === 'text') {
                response.text()
                  .then((textData) => {
                    reject({ data: textData, cause: `server error,statusCode:${response.status}`, response });
                  })
                  .catch((err) => {
                    reject({ data: null, cause: `client error,${err}`, response });
                  });
              }

            } else {
              // - response.ok の場合(status が 200-299 の範囲内の場合)
              if (dataType === 'json') {
                response.json()
                  .then((jsonData) => {
                    resolve({ data: jsonData, response });
                  })
                  .catch((err) => {
                    reject({ data: null, cause: `client error,${err}`, response });
                  });


              } else if (dataType === 'text') {
                response.text()
                  .then((textData) => {
                    //return Promise.resolve({ data: jsonData, response });
                    resolve({ data: textData, response });
                    // return {data:jsonData,response}; // is also ok
                  })
                  .catch((err) => {
                    reject({ data: null, cause: `client error,${err}`, response });
                  });
              }
            }
          })
          .catch((err) => {
            console.log("エラー", err)
            reject({ data: null, cause: `network error`, response: null, err });
          });
      });
    };

    fnTimeout(fetchPromise, options)
      .then(
        (result) => {
          // - resolve を受け取った
          //asyncResult._success(result.data, result.response);
          asyncResult._success(result);
          if (options && options.success) {
            options.success(result.data, result.response);//data.data);
          }
        })
      .catch(errResult => {

        // - reject を受け取る
        //const errorObj = errResult;
        //asyncResult._fail(errResult.data, errResult.response,errResult.cause,errResult.err);// todo なにこれ
        asyncResult._fail(errResult);

        if (errResult.cause === 'timeout') {

          if (options && options.timeout) {
            options.timeout(errResult.data, errResult.response, errResult.cause, errResult.err);
          }
        } else {
          if (options && options.error) {
            //options.error(errResult, errResult.response);
            options.error(errResult.data, errResult.response, errResult.cause, errResult.err);

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

      asyncResult._success({ data: res, response: null });
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

  _success(successResult) {
    if (this._successFunc) {
      this._successFunc(successResult.data, successResult.response);
    }

  }

  _fail(errResult) {
    if (this._failFunc) {
      this._failFunc(errResult.data, errResult.response, errResult.cause, errResult.err);
    }
  }

}
