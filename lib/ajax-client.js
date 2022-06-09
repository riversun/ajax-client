(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AjaxClient.js":
/*!***************************!*\
  !*** ./src/AjaxClient.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AjaxClient": () => (/* binding */ AjaxClient)
/* harmony export */ });
/**
 * AjaxClient
 * Simple XMLHttpRequest client.
 * Now supported 'post' method,dataType 'json'
 */
class AjaxClient {
  constructor() {}

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
      if (this.typeOf(options.data) === 'String') {} else {
        const obj = options.data;
        options.data = JSON.stringify(obj);
      }
    }

    return new Promise(resolve => {
      options.success = (data, xhr) => {
        resolve({
          success: true,
          data: data,
          response: xhr
        });
      };

      options.error = (e, xhr) => {
        resolve({
          success: false,
          cause: 'error',
          error: e,
          response: xhr
        });
      };

      options.timeout = e => {
        resolve({
          success: false,
          cause: 'timeout',
          error: e,
          response: null
        });
      };

      this.ajax(options);
    });
  }

  async post(options) {
    options.type = 'post';

    if (options.contentType === 'application/json') {
      if (this.typeOf(options.data) === 'String') {} else {
        const obj = options.data;
        options.data = JSON.stringify(obj);
      }
    }

    return new Promise(resolve => {
      options.success = response => {
        resolve({
          success: true,
          data: response
        });
      };

      options.error = e => {
        resolve({
          success: false,
          cause: 'error',
          error: e
        });
      };

      options.timeout = e => {
        resolve({
          success: false,
          cause: 'timeout',
          error: e
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
    } //use async mode


    const ASYNC = true;

    if (options.type && options.type.toLowerCase() === 'post') {
      xhr.open('POST', options.url, ASYNC);
    } else if (options.type && options.type.toLowerCase() === 'get') {
      xhr.open('GET', options.url, ASYNC);
    } else {
      throw Error("type:".concat(options.type, " is not supported"));
    } //Supported only 'json' method by now.


    if (options.dataType && options.dataType === 'json') {
      xhr.responseType = 'text';
    } else if (options.dataType && options.dataType === 'text') {
      xhr.responseType = 'text';
    } else {
      throw Error("Please check dataType:".concat(options.dataType, ". \"json\" or \"text\"  is supported as dataType now."));
    }

    if (options.contentType) {
      try {
        xhr.setRequestHeader('Content-Type', options.contentType);
      } catch (e) {
        throw Error("Invalid content type ".concat(options.contentType));
      }
    } else {
      if (options.type && options.type.toLowerCase() === 'post' || options.type && options.type.toLowerCase() === 'put') {
        throw Error('Please specify contentType.');
      }
    } //Original headers


    if (options.headers) {
      for (const key in options.headers) {
        const value = options.headers[key];
        xhr.setRequestHeader(key, value);
      }
    } // todo add support "xhrFields" for ajaxclient2(using FETCH API)
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


    if (options.xhrFields) {
      // options.crossDomain  is not mandatory on XHR
      const {
        xhrFields
      } = options;

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
      xhr.ontimeout = e => {
        options.timeout(e, xhr);
      };
    }

    if (options.error) {
      xhr.onerror = e => {
        options.error(e, xhr);
      };
    }

    if (options.type && options.type.toLowerCase() === 'post') {
      if (options.data) {
        if (options.contentType.startsWith('application/x-www-form-urlencoded')) {
          const fnEncodeForm = formData => {
            const params = [];

            for (const name in formData) {
              const value = formData[name];
              const param = encodeURIComponent(name) + '=' + encodeURIComponent(value);
              params.push(param);
            }

            return params.join('&').replace(/%20/g, '+'); // encoded space(=%20) to '+'
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
    } else {}
  }

  typeOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  }

}

/***/ }),

/***/ "./src/AjaxClient2.js":
/*!****************************!*\
  !*** ./src/AjaxClient2.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AjaxClient2": () => (/* binding */ AjaxClient2)
/* harmony export */ });
/**
 * AjaxClient2
 * ajax2 with fetch api
 * MIT License
 *
 * @author Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)
 */
class AjaxClient2 {
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
      if (this.typeOf(options.data) === 'String') {} else {
        const obj = options.data;
        options.data = JSON.stringify(obj);
      }
    }

    return new Promise(resolve => {
      options.success = (data, response) => {
        resolve({
          success: true,
          data: data,
          response
        });
      };

      options.error = (data, response, cause, err) => {
        resolve({
          success: false,
          data,
          cause: cause,
          error: err,
          response: response
        });
      };

      options.timeout = (data, response, cause, err) => {
        resolve({
          success: false,
          data,
          cause: cause,
          error: err,
          response: response
        });
      };

      this.ajax(options);
    });
  }

  async post(options) {
    options.type = 'post';

    if (options.contentType === 'application/json') {
      if (this.typeOf(options.data) === 'String') {} else {
        const obj = options.data;
        options.data = JSON.stringify(obj);
      }
    }

    return new Promise(resolve => {
      options.success = (data, response) => {
        resolve({
          success: true,
          data: data,
          response
        });
      };

      options.error = (data, response, cause, err) => {
        resolve({
          success: false,
          data,
          cause: cause,
          error: err,
          response: response
        });
      };

      options.timeout = (data, response, cause, err) => {
        resolve({
          success: false,
          data,
          cause: cause,
          error: err,
          response: response
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
      postBody = data; //JSON.stringify(data);

      if (dataType === 'jsonp') {
        //POST and jsonp specified
        throw new Error("type:'POST' and 'dataType:jsonp' are specified together.\n                'POST' and 'jsonp' can not be specified together");
      }
    }

    if (headers && dataType === 'jsonp') {
      //http-headers and jsonp specified
      throw new Error("'headers' and 'dataType:jsonp' can not be specified together.\n           Http headers cannot be sent when using jsonp.");
    }

    const reqParam = {
      url: url,
      method: method,
      body: postBody,
      contentType: contentType
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
      throw new Error("Please check dataType:".concat(dataType, " dataType must be 'json' or 'jsonp'"));
    }
  }

  _getFetchParam(reqParam, options) {
    const method = reqParam.method.toUpperCase();
    const fetchParam = {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      headers: {//'Accept': 'application/json',
        //'Content-Type': 'application/json'
      } //credentials:null,// 'include',
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
      const {
        xhrFields
      } = options;

      if (xhrFields.withCredentials === true) {
        fetchParam.credentials = 'include';
      }
    } //populate credentials


    if (reqParam.credentials) {
      fetchParam.credentials = reqParam.credentials;
    } //populate headers


    if (reqParam.headers) {
      for (const key in reqParam.headers) {
        const value = reqParam.headers[key];
        fetchParam.headers[key] = value;
      }
    } //populate body


    if (reqParam.body) {
      if (reqParam.contentType.startsWith('application/x-www-form-urlencoded')) {
        const fnEncodeForm = formData => {
          const params = [];

          for (const name in formData) {
            const value = formData[name];
            const param = encodeURIComponent(name) + '=' + encodeURIComponent(value);
            params.push(param);
          }

          return params.join('&').replace(/%20/g, '+'); // encoded space(=%20) to '+'
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
            reject({
              data: null,
              cause: "timeout,".concat(options.timeoutMillis, "ms elapsed"),
              response: null
            });
          }, options.timeoutMillis);
        } // (2)


        promise.then(response => {
          if (!response.ok) {
            // - !response.okの場合(status が 200-299 の範囲外の場合)
            if (dataType === 'json') {
              response.json().then(jsonData => {
                reject({
                  data: jsonData,
                  cause: "server error,statusCode:".concat(response.status),
                  response
                });
              }).catch(err => {
                // json parse error の場合は text　でとりなおす
                response.text().then(textData => {
                  reject({
                    data: textData,
                    cause: "server error,statusCode:".concat(response.status),
                    response
                  });
                }).catch(err => {
                  reject({
                    data: null,
                    cause: "client error,".concat(err),
                    response
                  });
                }); // reject({ data: null, cause: `client error,${err}`, response });
              });
            } else if (dataType === 'text') {
              response.text().then(textData => {
                reject({
                  data: textData,
                  cause: "server error,statusCode:".concat(response.status),
                  response
                });
              }).catch(err => {
                reject({
                  data: null,
                  cause: "client error,".concat(err),
                  response
                });
              });
            }
          } else {
            // - response.ok の場合(status が 200-299 の範囲内の場合)
            if (dataType === 'json') {
              response.json().then(jsonData => {
                resolve({
                  data: jsonData,
                  response
                });
              }).catch(err => {
                reject({
                  data: null,
                  cause: "client error,".concat(err),
                  response
                });
              });
            } else if (dataType === 'text') {
              response.text().then(textData => {
                //return Promise.resolve({ data: jsonData, response });
                resolve({
                  data: textData,
                  response
                }); // return {data:jsonData,response}; // is also ok
              }).catch(err => {
                reject({
                  data: null,
                  cause: "client error,".concat(err),
                  response
                });
              });
            }
          }
        }).catch(err => {
          console.log("エラー", err);
          reject({
            data: null,
            cause: "network error",
            response: null,
            err
          });
        });
      });
    };

    fnTimeout(fetchPromise, options).then(result => {
      // - resolve を受け取った
      //asyncResult._success(result.data, result.response);
      asyncResult._success(result);

      if (options && options.success) {
        options.success(result.data, result.response); //data.data);
      }
    }).catch(errResult => {
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
    const callbackFuncName = "ajaxclient2_".concat(this._createUUID());
    let src = reqParam.url;

    if (src.indexOf('?') >= 0) {
      src += "&callback=".concat(callbackFuncName);
    } else {
      src += "?callback=".concat(callbackFuncName);
    }

    scriptEle.src = src;
    scriptEle.addEventListener('error', errorObj => {
      asyncResult._fail(errorObj);

      if (options && options.error) {
        options.error(errorObj, null);
      }
    }); //global object

    window[callbackFuncName] = res => {
      delete window[callbackFuncName];

      asyncResult._success({
        data: res,
        response: null
      });

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
          url += "".concat(paramKey, "=").concat(paramVal, "&");
        }

        url = url.substring(0, url.length - 1);
      }

      return url;
    } else {
      throw Error("Invalid type ".concat(options.type, " is not supported"));
    }
  }

  _createUUID() {
    const dateTime = new Date().getTime();
    const uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (dateTime + Math.random() * 16) % 16 | 0;
      return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  }

  typeOf(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  }

}

class AjaxResult {
  constructor() {
    this._successFunc = () => {};

    this._failFunc = () => {};
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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AjaxClient": () => (/* reexport safe */ _AjaxClient_js__WEBPACK_IMPORTED_MODULE_0__.AjaxClient),
/* harmony export */   "AjaxClient2": () => (/* reexport safe */ _AjaxClient2_js__WEBPACK_IMPORTED_MODULE_1__.AjaxClient2)
/* harmony export */ });
/* harmony import */ var _AjaxClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AjaxClient.js */ "./src/AjaxClient.js");
/* harmony import */ var _AjaxClient2_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AjaxClient2.js */ "./src/AjaxClient2.js");



})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TCxZQUFULEVBQXVCO01BQ3JCLEtBQUtBLFlBQUwsQ0FBa0JLLGFBQWEsQ0FBQzVILElBQWhDLEVBQXNDNEgsYUFBYSxDQUFDcEgsUUFBcEQ7SUFDRDtFQUVGOztFQUVEa0YsS0FBSyxDQUFDRCxTQUFELEVBQVk7SUFDZixJQUFJLEtBQUsrQixTQUFULEVBQW9CO01BQ2xCLEtBQUtBLFNBQUwsQ0FBZS9CLFNBQVMsQ0FBQ3pGLElBQXpCLEVBQStCeUYsU0FBUyxDQUFDakYsUUFBekMsRUFBbURpRixTQUFTLENBQUM5RSxLQUE3RCxFQUFvRThFLFNBQVMsQ0FBQ3BDLEdBQTlFO0lBQ0Q7RUFDRjs7QUFoQ2M7Ozs7OztVQ2piakI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2FqYXgtY2xpZW50L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9hamF4LWNsaWVudC8uL3NyYy9BamF4Q2xpZW50LmpzIiwid2VicGFjazovL2FqYXgtY2xpZW50Ly4vc3JjL0FqYXhDbGllbnQyLmpzIiwid2VicGFjazovL2FqYXgtY2xpZW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FqYXgtY2xpZW50L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hamF4LWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FqYXgtY2xpZW50L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYWpheC1jbGllbnQvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvKipcbiAqIEFqYXhDbGllbnRcbiAqIFNpbXBsZSBYTUxIdHRwUmVxdWVzdCBjbGllbnQuXG4gKiBOb3cgc3VwcG9ydGVkICdwb3N0JyBtZXRob2QsZGF0YVR5cGUgJ2pzb24nXG4gKi9cbmV4cG9ydCBjbGFzcyBBamF4Q2xpZW50IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIGdldEFzeW5jKG9wdGlvbnMpIHtcblxuICAgIG9wdGlvbnMudHlwZSA9ICdnZXQnO1xuICAgIHRoaXMuYWpheChvcHRpb25zKTtcbiAgfVxuXG4gIHBvc3RBc3luYyhvcHRpb25zKSB7XG4gICAgb3B0aW9ucy50eXBlID0gJ3Bvc3QnO1xuICAgIHRoaXMuYWpheChvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldChvcHRpb25zKSB7XG4gICAgb3B0aW9ucy50eXBlID0gJ2dldCc7XG5cbiAgICBpZiAob3B0aW9ucy5jb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSB7XG4gICAgICBpZiAodGhpcy50eXBlT2Yob3B0aW9ucy5kYXRhKSA9PT0gJ1N0cmluZycpIHtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgb2JqID0gb3B0aW9ucy5kYXRhO1xuICAgICAgICBvcHRpb25zLmRhdGEgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgb3B0aW9ucy5zdWNjZXNzID0gKGRhdGEseGhyKSA9PiB7XG4gICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBkYXRhLHJlc3BvbnNlOnhociB9KTtcbiAgICAgIH07XG4gICAgICBvcHRpb25zLmVycm9yID0gKGUseGhyKSA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGNhdXNlOiAnZXJyb3InLFxuICAgICAgICAgIGVycm9yOiBlLFxuICAgICAgICAgIHJlc3BvbnNlOnhocixcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgb3B0aW9ucy50aW1lb3V0ID0gKGUpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgY2F1c2U6ICd0aW1lb3V0JyxcbiAgICAgICAgICBlcnJvcjogZSxcbiAgICAgICAgICByZXNwb25zZTpudWxsLFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFqYXgob3B0aW9ucyk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGFzeW5jIHBvc3Qob3B0aW9ucykge1xuICAgIG9wdGlvbnMudHlwZSA9ICdwb3N0JztcblxuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgIGlmICh0aGlzLnR5cGVPZihvcHRpb25zLmRhdGEpID09PSAnU3RyaW5nJykge1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBvYmogPSBvcHRpb25zLmRhdGE7XG4gICAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBvcHRpb25zLnN1Y2Nlc3MgPSAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICBkYXRhOiByZXNwb25zZVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBvcHRpb25zLmVycm9yID0gKGUpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgY2F1c2U6ICdlcnJvcicsXG4gICAgICAgICAgZXJyb3I6IGUsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIG9wdGlvbnMudGltZW91dCA9IChlKSA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGNhdXNlOiAndGltZW91dCcsXG4gICAgICAgICAgZXJyb3I6IGUsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYWpheChvcHRpb25zKTtcbiAgICB9KTtcblxuXG4gIH1cblxuICBhamF4KG9wdGlvbnMpIHtcbiAgICAvL3VzZSBYTUxIdHRwUmVxdWVzdDIgc3R5bGVcbiAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgdGhyb3cgRXJyb3IoJ1BsZWFzZSBzcGVjaWZ5IG9wdGlvbnMgbGlrZSAjYWpheChvcHRpb25zKScpO1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMudXJsKSB7XG4gICAgICB0aHJvdyBFcnJvcignUGxlYXNlIHNwZWNpZnkgdXJsLicpO1xuICAgIH1cblxuXG4gICAgLy91c2UgYXN5bmMgbW9kZVxuICAgIGNvbnN0IEFTWU5DID0gdHJ1ZTtcblxuICAgIGlmIChvcHRpb25zLnR5cGUgJiYgb3B0aW9ucy50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdwb3N0Jykge1xuICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBvcHRpb25zLnVybCwgQVNZTkMpO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy50eXBlICYmIG9wdGlvbnMudHlwZS50b0xvd2VyQ2FzZSgpID09PSAnZ2V0Jykge1xuICAgICAgeGhyLm9wZW4oJ0dFVCcsIG9wdGlvbnMudXJsLCBBU1lOQyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IEVycm9yKGB0eXBlOiR7b3B0aW9ucy50eXBlfSBpcyBub3Qgc3VwcG9ydGVkYCk7XG4gICAgfVxuXG5cbiAgICAvL1N1cHBvcnRlZCBvbmx5ICdqc29uJyBtZXRob2QgYnkgbm93LlxuICAgIGlmIChvcHRpb25zLmRhdGFUeXBlICYmIG9wdGlvbnMuZGF0YVR5cGUgPT09ICdqc29uJykge1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICd0ZXh0JztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YVR5cGUgJiYgb3B0aW9ucy5kYXRhVHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ3RleHQnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBFcnJvcihgUGxlYXNlIGNoZWNrIGRhdGFUeXBlOiR7b3B0aW9ucy5kYXRhVHlwZX0uIFwianNvblwiIG9yIFwidGV4dFwiICBpcyBzdXBwb3J0ZWQgYXMgZGF0YVR5cGUgbm93LmApO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgb3B0aW9ucy5jb250ZW50VHlwZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IEVycm9yKGBJbnZhbGlkIGNvbnRlbnQgdHlwZSAke29wdGlvbnMuY29udGVudFR5cGV9YCk7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9wdGlvbnMudHlwZSAmJiBvcHRpb25zLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3Bvc3QnIHx8IG9wdGlvbnMudHlwZSAmJiBvcHRpb25zLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3B1dCcpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1BsZWFzZSBzcGVjaWZ5IGNvbnRlbnRUeXBlLicpO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy9PcmlnaW5hbCBoZWFkZXJzXG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycykge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gb3B0aW9ucy5oZWFkZXJzW2tleV07XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRvZG8gYWRkIHN1cHBvcnQgXCJ4aHJGaWVsZHNcIiBmb3IgYWpheGNsaWVudDIodXNpbmcgRkVUQ0ggQVBJKVxuICAgIC8vIE5vdGU6aW4gZmV0Y2ggQVBJXG4gICAgLy8gZmV0Y2godXJsLCB7XG4gICAgLy8gICBtb2RlOiAnY29ycycsIC8vIGluc3RlYWQgb2YgXCJjcm9zc0RvbWFpbjogdHJ1ZVwiIGluIGpRdWVyeVxuICAgIC8vICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyAvLyB3aXRoIGNyZWRlbnRpYWxzXG4gICAgLy8gfSlcbiAgICAvLyBOb3RlOmluIGpRdWVyeSBBUElcbiAgICAvLyAkLmFqYXgoe1xuICAgIC8vICAgdXJsOiBcInNvbWVcIixcbiAgICAvLyBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAvLyAgIHhockZpZWxkczoge1xuICAgIC8vICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcbiAgICAvLyAgIH1cbiAgICAvLyBOb3RlOmluIFhIUlxuICAgIC8vIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgIGlmIChvcHRpb25zLnhockZpZWxkcykgeyAvLyBvcHRpb25zLmNyb3NzRG9tYWluICBpcyBub3QgbWFuZGF0b3J5IG9uIFhIUlxuICAgICAgY29uc3QgeyB4aHJGaWVsZHMgfSA9IG9wdGlvbnM7XG4gICAgICBpZiAoeGhyRmllbGRzLndpdGhDcmVkZW50aWFscyA9PT0gdHJ1ZSkge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy50aW1lb3V0TWlsbGlzKSB7XG4gICAgICB4aHIudGltZW91dCA9IG9wdGlvbnMudGltZW91dE1pbGxpcztcbiAgICB9XG5cbiAgICB4aHIub25sb2FkID0gZXZ0ID0+IHtcblxuICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XG5cbiAgICAgICAgbGV0IGRhdGEgPSAnJztcbiAgICAgICAgaWYgKG9wdGlvbnMuZGF0YVR5cGUgPT0gJ2pzb24nKSB7XG5cbiAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IHhoci5yZXNwb25zZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XG4gICAgICAgICAgb3B0aW9ucy5zdWNjZXNzKGRhdGEsIHhocik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy9jb25zb2xlLmVycm9yKFwiZXJyb3I6XCIgKyB4aHIuc3RhdHVzVGV4dCk7XG4gICAgICAgIGlmIChvcHRpb25zLmVycm9yKSB7XG4gICAgICAgICAgb3B0aW9ucy5lcnJvcihldnQsIHhocik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKG9wdGlvbnMudGltZW91dCkge1xuICAgICAgeGhyLm9udGltZW91dCA9IChlKSA9PiB7XG4gICAgICAgIG9wdGlvbnMudGltZW91dChlLCB4aHIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5lcnJvcikge1xuICAgICAgeGhyLm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgICBvcHRpb25zLmVycm9yKGUsIHhocik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudHlwZSAmJiBvcHRpb25zLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3Bvc3QnKSB7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlLnN0YXJ0c1dpdGgoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpKSB7XG4gICAgICAgICAgY29uc3QgZm5FbmNvZGVGb3JtID0gKGZvcm1EYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBmb3JtRGF0YSkge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGZvcm1EYXRhW25hbWVdO1xuICAgICAgICAgICAgICBjb25zdCBwYXJhbSA9IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG4gICAgICAgICAgICAgIHBhcmFtcy5wdXNoKHBhcmFtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXJhbXMuam9pbignJicpLnJlcGxhY2UoLyUyMC9nLCAnKycpOy8vIGVuY29kZWQgc3BhY2UoPSUyMCkgdG8gJysnXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gZm5FbmNvZGVGb3JtKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgICAgeGhyLnNlbmQoZm9ybURhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHhoci5zZW5kKG9wdGlvbnMuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IEVycm9yKCcuZGF0YSBpcyBub3Qgc3BlY2lmaWVkLmRhdGEgbXVzdCBiZSBzcGVjaWZpZWQgb24gXCJQT1NUXCIgbW9kZS4nKTtcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAob3B0aW9ucy50eXBlICYmIG9wdGlvbnMudHlwZS50b0xvd2VyQ2FzZSgpID09PSAnZ2V0Jykge1xuICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICB9XG4gIH1cblxuICB0eXBlT2Yob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopXG4gICAgICAuc2xpY2UoOCwgLTEpO1xuICB9XG59XG4iLCJcbi8qKlxuICogQWpheENsaWVudDJcbiAqIGFqYXgyIHdpdGggZmV0Y2ggYXBpXG4gKiBNSVQgTGljZW5zZVxuICpcbiAqIEBhdXRob3IgVG9tIE1pc2F3YSAocml2ZXJzdW4ub3JnQGdtYWlsLmNvbSxodHRwczovL2dpdGh1Yi5jb20vcml2ZXJzdW4pXG4gKi9cbmV4cG9ydCBjbGFzcyBBamF4Q2xpZW50MiB7XG5cbiAgY29uc3RydWN0b3Iob3B0KSB7XG4gICAgdGhpcy5vcHQgPSBvcHQgfHwge307XG4gIH1cblxuICBnZXRBc3luYyhvcHRpb25zKSB7XG5cbiAgICBvcHRpb25zLnR5cGUgPSAnZ2V0JztcbiAgICB0aGlzLmFqYXgob3B0aW9ucyk7XG4gIH1cblxuICBwb3N0QXN5bmMob3B0aW9ucykge1xuICAgIG9wdGlvbnMudHlwZSA9ICdwb3N0JztcbiAgICB0aGlzLmFqYXgob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXQob3B0aW9ucykge1xuICAgIG9wdGlvbnMudHlwZSA9ICdnZXQnO1xuXG4gICAgaWYgKG9wdGlvbnMuY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJykge1xuICAgICAgaWYgKHRoaXMudHlwZU9mKG9wdGlvbnMuZGF0YSkgPT09ICdTdHJpbmcnKSB7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG9wdGlvbnMuZGF0YTtcbiAgICAgICAgb3B0aW9ucy5kYXRhID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIG9wdGlvbnMuc3VjY2VzcyA9IChkYXRhLCByZXNwb25zZSkgPT4ge1xuICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogZGF0YSwgcmVzcG9uc2UgfSk7XG4gICAgICB9O1xuICAgICAgb3B0aW9ucy5lcnJvciA9IChkYXRhLCByZXNwb25zZSwgY2F1c2UsIGVycikgPT4ge1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGNhdXNlOiBjYXVzZSxcbiAgICAgICAgICBlcnJvcjogZXJyLFxuICAgICAgICAgIHJlc3BvbnNlOiByZXNwb25zZSxcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgb3B0aW9ucy50aW1lb3V0ID0gKGRhdGEsIHJlc3BvbnNlLCBjYXVzZSwgZXJyKSA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgY2F1c2U6IGNhdXNlLFxuICAgICAgICAgIGVycm9yOiBlcnIsXG4gICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlLFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFqYXgob3B0aW9ucyk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIGFzeW5jIHBvc3Qob3B0aW9ucykge1xuICAgIG9wdGlvbnMudHlwZSA9ICdwb3N0JztcblxuICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgIGlmICh0aGlzLnR5cGVPZihvcHRpb25zLmRhdGEpID09PSAnU3RyaW5nJykge1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBvYmogPSBvcHRpb25zLmRhdGE7XG4gICAgICAgIG9wdGlvbnMuZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBvcHRpb25zLnN1Y2Nlc3MgPSAoZGF0YSwgcmVzcG9uc2UpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBvcHRpb25zLmVycm9yID0gKGRhdGEsIHJlc3BvbnNlLCBjYXVzZSwgZXJyKSA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgY2F1c2U6IGNhdXNlLFxuICAgICAgICAgIGVycm9yOiBlcnIsXG4gICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlLFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBvcHRpb25zLnRpbWVvdXQgPSAoZGF0YSwgcmVzcG9uc2UsIGNhdXNlLCBlcnIpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBjYXVzZTogY2F1c2UsXG4gICAgICAgICAgZXJyb3I6IGVycixcbiAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2UsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYWpheChvcHRpb25zKTtcbiAgICB9KTtcblxuXG4gIH1cblxuICBhamF4KG9wdGlvbnMpIHtcblxuICAgIGNvbnN0IHVybCA9IHRoaXMuX2NyZWF0ZVVybChvcHRpb25zKTtcbiAgICBjb25zdCBtZXRob2QgPSBvcHRpb25zLnR5cGU7XG4gICAgY29uc3QgZGF0YVR5cGUgPSBvcHRpb25zLmRhdGFUeXBlO1xuICAgIGNvbnN0IGRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgY29uc3QgaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycztcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IG9wdGlvbnMuY29udGVudFR5cGU7XG5cblxuICAgIGxldCBwb3N0Qm9keSA9IG51bGw7XG5cbiAgICBpZiAoIXVybCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1BsZWFzZSBzcGVjaWZ5IHVybC4nKTtcbiAgICB9XG4gICAgaWYgKG1ldGhvZCAmJiBtZXRob2QudG9Mb3dlckNhc2UoKSA9PT0gJ3Bvc3QnKSB7XG5cbiAgICAgIHBvc3RCb2R5ID0gZGF0YTsvL0pTT04uc3RyaW5naWZ5KGRhdGEpO1xuXG4gICAgICBpZiAoZGF0YVR5cGUgPT09ICdqc29ucCcpIHtcbiAgICAgICAgLy9QT1NUIGFuZCBqc29ucCBzcGVjaWZpZWRcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB0eXBlOidQT1NUJyBhbmQgJ2RhdGFUeXBlOmpzb25wJyBhcmUgc3BlY2lmaWVkIHRvZ2V0aGVyLlxuICAgICAgICAgICAgICAgICdQT1NUJyBhbmQgJ2pzb25wJyBjYW4gbm90IGJlIHNwZWNpZmllZCB0b2dldGhlcmApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoZWFkZXJzICYmIGRhdGFUeXBlID09PSAnanNvbnAnKSB7XG4gICAgICAvL2h0dHAtaGVhZGVycyBhbmQganNvbnAgc3BlY2lmaWVkXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCdoZWFkZXJzJyBhbmQgJ2RhdGFUeXBlOmpzb25wJyBjYW4gbm90IGJlIHNwZWNpZmllZCB0b2dldGhlci5cbiAgICAgICAgICAgSHR0cCBoZWFkZXJzIGNhbm5vdCBiZSBzZW50IHdoZW4gdXNpbmcganNvbnAuYCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxUGFyYW0gPSB7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgYm9keTogcG9zdEJvZHksXG4gICAgICBjb250ZW50VHlwZTogY29udGVudFR5cGUsXG4gICAgfTtcblxuICAgIGlmIChoZWFkZXJzKSB7XG4gICAgICByZXFQYXJhbS5oZWFkZXJzID0gaGVhZGVycztcbiAgICB9XG5cblxuICAgIGlmIChkYXRhVHlwZSA9PT0gJ2pzb24nIHx8IGRhdGFUeXBlID09PSAndGV4dCcpIHtcbiAgICAgIGNvbnN0IGFzeW5jUmVzdWx0ID0gdGhpcy5faGFuZGxlRGF0YShyZXFQYXJhbSwgZGF0YVR5cGUsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIGFzeW5jUmVzdWx0O1xuICAgIH0gZWxzZSBpZiAoZGF0YVR5cGUgPT09ICdqc29ucCcpIHtcbiAgICAgIGNvbnN0IGFzeW5jUmVzdWx0ID0gdGhpcy5faGFuZGxlSnNvbnAocmVxUGFyYW0sIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIGFzeW5jUmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFBsZWFzZSBjaGVjayBkYXRhVHlwZToke2RhdGFUeXBlfSBkYXRhVHlwZSBtdXN0IGJlICdqc29uJyBvciAnanNvbnAnYCk7XG4gICAgfVxuICB9XG5cbiAgX2dldEZldGNoUGFyYW0ocmVxUGFyYW0sIG9wdGlvbnMpIHtcblxuXG4gICAgY29uc3QgbWV0aG9kID0gcmVxUGFyYW0ubWV0aG9kLnRvVXBwZXJDYXNlKCk7XG4gICAgY29uc3QgZmV0Y2hQYXJhbSA9IHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgY2FjaGU6ICduby1jYWNoZScsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIC8vJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgLy8nQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9XG4gICAgICAvL2NyZWRlbnRpYWxzOm51bGwsLy8gJ2luY2x1ZGUnLFxuICAgICAgLy9yZWZlcnJlcjogJ25vLXJlZmVycmVyJyxcbiAgICB9O1xuXG4gICAgaWYgKHJlcVBhcmFtLmNvbnRlbnRUeXBlKSB7XG4gICAgICBmZXRjaFBhcmFtLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gcmVxUGFyYW0uY29udGVudFR5cGU7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1ldGhvZCA9PT0gJ1BPU1QnIHx8IG1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1BsZWFzZSBzcGVjaWZ5IGNvbnRlbnRUeXBlLicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnhockZpZWxkcykge1xuICAgICAgY29uc3QgeyB4aHJGaWVsZHMgfSA9IG9wdGlvbnM7XG4gICAgICBpZiAoeGhyRmllbGRzLndpdGhDcmVkZW50aWFscyA9PT0gdHJ1ZSkge1xuICAgICAgICBmZXRjaFBhcmFtLmNyZWRlbnRpYWxzID0gJ2luY2x1ZGUnO1xuICAgICAgfVxuICAgIH1cbiAgICAvL3BvcHVsYXRlIGNyZWRlbnRpYWxzXG4gICAgaWYgKHJlcVBhcmFtLmNyZWRlbnRpYWxzKSB7XG4gICAgICBmZXRjaFBhcmFtLmNyZWRlbnRpYWxzID0gcmVxUGFyYW0uY3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgLy9wb3B1bGF0ZSBoZWFkZXJzXG4gICAgaWYgKHJlcVBhcmFtLmhlYWRlcnMpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHJlcVBhcmFtLmhlYWRlcnMpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSByZXFQYXJhbS5oZWFkZXJzW2tleV07XG4gICAgICAgIGZldGNoUGFyYW0uaGVhZGVyc1trZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9wb3B1bGF0ZSBib2R5XG4gICAgaWYgKHJlcVBhcmFtLmJvZHkpIHtcblxuICAgICAgaWYgKHJlcVBhcmFtLmNvbnRlbnRUeXBlLnN0YXJ0c1dpdGgoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpKSB7XG5cbiAgICAgICAgY29uc3QgZm5FbmNvZGVGb3JtID0gKGZvcm1EYXRhKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGFyYW1zID0gW107XG4gICAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIGZvcm1EYXRhKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGZvcm1EYXRhW25hbWVdO1xuICAgICAgICAgICAgY29uc3QgcGFyYW0gPSBlbmNvZGVVUklDb21wb25lbnQobmFtZSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICAgICAgICAgICAgcGFyYW1zLnB1c2gocGFyYW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGFyYW1zLmpvaW4oJyYnKS5yZXBsYWNlKC8lMjAvZywgJysnKTsvLyBlbmNvZGVkIHNwYWNlKD0lMjApIHRvICcrJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gcmVxUGFyYW0uYm9keTtcbiAgICAgICAgY29uc3QgcGFyYW1zRnJvbUZvcm1EYXRhID0gZm5FbmNvZGVGb3JtKGZvcm1EYXRhKTtcbiAgICAgICAgZmV0Y2hQYXJhbS5ib2R5ID0gcGFyYW1zRnJvbUZvcm1EYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmV0Y2hQYXJhbS5ib2R5ID0gcmVxUGFyYW0uYm9keTtcbiAgICAgIH1cblxuXG4gICAgfVxuICAgIHJldHVybiBmZXRjaFBhcmFtO1xuICB9XG5cbiAgX2hhbmRsZURhdGEocmVxUGFyYW0sIGRhdGFUeXBlLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgYXN5bmNSZXN1bHQgPSBuZXcgQWpheFJlc3VsdCgpO1xuICAgIGNvbnN0IGZldGNoUGFyYW0gPSB0aGlzLl9nZXRGZXRjaFBhcmFtKHJlcVBhcmFtLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGZuRmV0Y2ggPSBzZWxmLm9wdC5mZXRjaCB8fCBmZXRjaDtcblxuICAgIGNvbnN0IGZldGNoUHJvbWlzZSA9IGZuRmV0Y2gocmVxUGFyYW0udXJsLCBmZXRjaFBhcmFtKTtcblxuICAgIGNvbnN0IGZuVGltZW91dCA9IChwcm9taXNlLCBvcHRpb25zKSA9PiB7XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgLy8oMSnjgr/jgqTjg6DjgqLjgqbjg4jjga5zZXRUaW1l44GoICgyKSBmZXRjaFByb21pc2XjgpLlkIzmmYLlrp/ooYxcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy50aW1lb3V0TWlsbGlzKSB7XG4gICAgICAgICAgLy8gKDEpXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QoeyBkYXRhOiBudWxsLCBjYXVzZTogYHRpbWVvdXQsJHtvcHRpb25zLnRpbWVvdXRNaWxsaXN9bXMgZWxhcHNlZGAsIHJlc3BvbnNlOiBudWxsIH0pO1xuICAgICAgICAgIH0sIG9wdGlvbnMudGltZW91dE1pbGxpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAoMilcbiAgICAgICAgcHJvbWlzZS50aGVuKFxuICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAvLyAtICFyZXNwb25zZS5va+OBruWgtOWQiChzdGF0dXMg44GMIDIwMC0yOTkg44Gu56+E5Zuy5aSW44Gu5aC05ZCIKVxuICAgICAgICAgICAgICBpZiAoZGF0YVR5cGUgPT09ICdqc29uJykge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmpzb24oKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oKGpzb25EYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh7IGRhdGE6IGpzb25EYXRhLCBjYXVzZTogYHNlcnZlciBlcnJvcixzdGF0dXNDb2RlOiR7cmVzcG9uc2Uuc3RhdHVzfWAsIHJlc3BvbnNlIH0pO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGpzb24gcGFyc2UgZXJyb3Ig44Gu5aC05ZCI44GvIHRleHTjgIDjgafjgajjgorjgarjgYrjgZlcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UudGV4dCgpXG4gICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHRleHREYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoeyBkYXRhOiB0ZXh0RGF0YSwgY2F1c2U6IGBzZXJ2ZXIgZXJyb3Isc3RhdHVzQ29kZToke3Jlc3BvbnNlLnN0YXR1c31gLCByZXNwb25zZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoeyBkYXRhOiBudWxsLCBjYXVzZTogYGNsaWVudCBlcnJvciwke2Vycn1gLCByZXNwb25zZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVqZWN0KHsgZGF0YTogbnVsbCwgY2F1c2U6IGBjbGllbnQgZXJyb3IsJHtlcnJ9YCwgcmVzcG9uc2UgfSk7XG4gICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGFUeXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZS50ZXh0KClcbiAgICAgICAgICAgICAgICAgIC50aGVuKCh0ZXh0RGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoeyBkYXRhOiB0ZXh0RGF0YSwgY2F1c2U6IGBzZXJ2ZXIgZXJyb3Isc3RhdHVzQ29kZToke3Jlc3BvbnNlLnN0YXR1c31gLCByZXNwb25zZSB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoeyBkYXRhOiBudWxsLCBjYXVzZTogYGNsaWVudCBlcnJvciwke2Vycn1gLCByZXNwb25zZSB9KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIC0gcmVzcG9uc2Uub2sg44Gu5aC05ZCIKHN0YXR1cyDjgYwgMjAwLTI5OSDjga7nr4Tlm7LlhoXjga7loLTlkIgpXG4gICAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PT0gJ2pzb24nKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuanNvbigpXG4gICAgICAgICAgICAgICAgICAudGhlbigoanNvbkRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IGRhdGE6IGpzb25EYXRhLCByZXNwb25zZSB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoeyBkYXRhOiBudWxsLCBjYXVzZTogYGNsaWVudCBlcnJvciwke2Vycn1gLCByZXNwb25zZSB9KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhVHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UudGV4dCgpXG4gICAgICAgICAgICAgICAgICAudGhlbigodGV4dERhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgZGF0YToganNvbkRhdGEsIHJlc3BvbnNlIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgZGF0YTogdGV4dERhdGEsIHJlc3BvbnNlIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4ge2RhdGE6anNvbkRhdGEscmVzcG9uc2V9OyAvLyBpcyBhbHNvIG9rXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHsgZGF0YTogbnVsbCwgY2F1c2U6IGBjbGllbnQgZXJyb3IsJHtlcnJ9YCwgcmVzcG9uc2UgfSk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi44Ko44Op44O8XCIsIGVycilcbiAgICAgICAgICAgIHJlamVjdCh7IGRhdGE6IG51bGwsIGNhdXNlOiBgbmV0d29yayBlcnJvcmAsIHJlc3BvbnNlOiBudWxsLCBlcnIgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgZm5UaW1lb3V0KGZldGNoUHJvbWlzZSwgb3B0aW9ucylcbiAgICAgIC50aGVuKFxuICAgICAgICAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgLy8gLSByZXNvbHZlIOOCkuWPl+OBkeWPluOBo+OBn1xuICAgICAgICAgIC8vYXN5bmNSZXN1bHQuX3N1Y2Nlc3MocmVzdWx0LmRhdGEsIHJlc3VsdC5yZXNwb25zZSk7XG4gICAgICAgICAgYXN5bmNSZXN1bHQuX3N1Y2Nlc3MocmVzdWx0KTtcbiAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhyZXN1bHQuZGF0YSwgcmVzdWx0LnJlc3BvbnNlKTsvL2RhdGEuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgLmNhdGNoKGVyclJlc3VsdCA9PiB7XG5cbiAgICAgICAgLy8gLSByZWplY3Qg44KS5Y+X44GR5Y+W44KLXG4gICAgICAgIC8vY29uc3QgZXJyb3JPYmogPSBlcnJSZXN1bHQ7XG4gICAgICAgIC8vYXN5bmNSZXN1bHQuX2ZhaWwoZXJyUmVzdWx0LmRhdGEsIGVyclJlc3VsdC5yZXNwb25zZSxlcnJSZXN1bHQuY2F1c2UsZXJyUmVzdWx0LmVycik7Ly8gdG9kbyDjgarjgavjgZPjgoxcbiAgICAgICAgYXN5bmNSZXN1bHQuX2ZhaWwoZXJyUmVzdWx0KTtcblxuICAgICAgICBpZiAoZXJyUmVzdWx0LmNhdXNlID09PSAndGltZW91dCcpIHtcblxuICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudGltZW91dCkge1xuICAgICAgICAgICAgb3B0aW9ucy50aW1lb3V0KGVyclJlc3VsdC5kYXRhLCBlcnJSZXN1bHQucmVzcG9uc2UsIGVyclJlc3VsdC5jYXVzZSwgZXJyUmVzdWx0LmVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZXJyb3IpIHtcbiAgICAgICAgICAgIC8vb3B0aW9ucy5lcnJvcihlcnJSZXN1bHQsIGVyclJlc3VsdC5yZXNwb25zZSk7XG4gICAgICAgICAgICBvcHRpb25zLmVycm9yKGVyclJlc3VsdC5kYXRhLCBlcnJSZXN1bHQucmVzcG9uc2UsIGVyclJlc3VsdC5jYXVzZSwgZXJyUmVzdWx0LmVycik7XG5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG5cbiAgICByZXR1cm4gYXN5bmNSZXN1bHQ7XG5cbiAgfVxuXG4gIF9oYW5kbGVKc29ucChyZXFQYXJhbSwgb3B0aW9ucykge1xuXG4gICAgY29uc3QgYXN5bmNSZXN1bHQgPSBuZXcgQWpheFJlc3VsdCgpO1xuICAgIGNvbnN0IHNjcmlwdEVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIGNvbnN0IGNhbGxiYWNrRnVuY05hbWUgPSBgYWpheGNsaWVudDJfJHt0aGlzLl9jcmVhdGVVVUlEKCl9YDtcblxuICAgIGxldCBzcmMgPSByZXFQYXJhbS51cmw7XG4gICAgaWYgKHNyYy5pbmRleE9mKCc/JykgPj0gMCkge1xuICAgICAgc3JjICs9IGAmY2FsbGJhY2s9JHtjYWxsYmFja0Z1bmNOYW1lfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNyYyArPSBgP2NhbGxiYWNrPSR7Y2FsbGJhY2tGdW5jTmFtZX1gO1xuICAgIH1cbiAgICBzY3JpcHRFbGUuc3JjID0gc3JjO1xuICAgIHNjcmlwdEVsZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlcnJvck9iaikgPT4ge1xuICAgICAgYXN5bmNSZXN1bHQuX2ZhaWwoZXJyb3JPYmopO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lcnJvcikge1xuICAgICAgICBvcHRpb25zLmVycm9yKGVycm9yT2JqLCBudWxsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vZ2xvYmFsIG9iamVjdFxuICAgIHdpbmRvd1tjYWxsYmFja0Z1bmNOYW1lXSA9IChyZXMpID0+IHtcbiAgICAgIGRlbGV0ZSB3aW5kb3dbY2FsbGJhY2tGdW5jTmFtZV07XG5cbiAgICAgIGFzeW5jUmVzdWx0Ll9zdWNjZXNzKHsgZGF0YTogcmVzLCByZXNwb25zZTogbnVsbCB9KTtcbiAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc3VjY2Vzcykge1xuXG4gICAgICAgIG9wdGlvbnMuc3VjY2VzcyhyZXMsIG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBwYXJlbnRFbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpID8gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSA6IGRvY3VtZW50LmJvZHk7XG4gICAgcGFyZW50RWxlLmFwcGVuZENoaWxkKHNjcmlwdEVsZSk7XG5cbiAgICByZXR1cm4gYXN5bmNSZXN1bHQ7XG5cbiAgfVxuXG4gIF9jcmVhdGVVcmwob3B0aW9ucykge1xuXG4gICAgaWYgKG9wdGlvbnMudHlwZSAmJiBvcHRpb25zLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3Bvc3QnKSB7XG4gICAgICAvL1BPU1RcbiAgICAgIHJldHVybiBvcHRpb25zLnVybDtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMudHlwZSAmJiBvcHRpb25zLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2dldCcpIHtcbiAgICAgIC8vR0VUXG4gICAgICBsZXQgdXJsID0gb3B0aW9ucy51cmw7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG5cbiAgICAgICAgY29uc3QgcGFyYW1EYXRhID0gSlNPTi5wYXJzZShvcHRpb25zLmRhdGEpO1xuXG4gICAgICAgIHVybCA9IHVybCArICc/JztcbiAgICAgICAgZm9yIChsZXQgcGFyYW1LZXkgb2YgT2JqZWN0LmtleXMocGFyYW1EYXRhKSkge1xuICAgICAgICAgIGNvbnN0IHBhcmFtVmFsID0gcGFyYW1EYXRhW3BhcmFtS2V5XTtcbiAgICAgICAgICB1cmwgKz0gYCR7cGFyYW1LZXl9PSR7cGFyYW1WYWx9JmA7XG4gICAgICAgIH1cbiAgICAgICAgdXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwubGVuZ3RoIC0gMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBFcnJvcihgSW52YWxpZCB0eXBlICR7b3B0aW9ucy50eXBlfSBpcyBub3Qgc3VwcG9ydGVkYCk7XG4gICAgfVxuICB9XG5cbiAgX2NyZWF0ZVVVSUQoKSB7XG4gICAgY29uc3QgZGF0ZVRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBjb25zdCB1dWlkID0gJ3h4eHh4eHh4X3h4eHhfNHh4eF95eHh4X3h4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgICBjb25zdCByID0gKGRhdGVUaW1lICsgTWF0aC5yYW5kb20oKSAqIDE2KSAlIDE2IHwgMDtcbiAgICAgIHJldHVybiAoYyA9PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpKS50b1N0cmluZygxNik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHV1aWQ7XG4gIH1cblxuICB0eXBlT2Yob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopXG4gICAgICAuc2xpY2UoOCwgLTEpO1xuICB9XG59XG5cbmNsYXNzIEFqYXhSZXN1bHQge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG5cbiAgICB0aGlzLl9zdWNjZXNzRnVuYyA9ICgpID0+IHtcbiAgICB9O1xuICAgIHRoaXMuX2ZhaWxGdW5jID0gKCkgPT4ge1xuICAgIH07XG4gIH1cblxuICBkb25lKGNhbGxiYWNrRnVuYykge1xuICAgIHRoaXMuX3N1Y2Nlc3NGdW5jID0gY2FsbGJhY2tGdW5jO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZmFpbChjYWxsYmFja0Z1bmMpIHtcbiAgICB0aGlzLl9mYWlsRnVuYyA9IGNhbGxiYWNrRnVuYztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9zdWNjZXNzKHN1Y2Nlc3NSZXN1bHQpIHtcbiAgICBpZiAodGhpcy5fc3VjY2Vzc0Z1bmMpIHtcbiAgICAgIHRoaXMuX3N1Y2Nlc3NGdW5jKHN1Y2Nlc3NSZXN1bHQuZGF0YSwgc3VjY2Vzc1Jlc3VsdC5yZXNwb25zZSk7XG4gICAgfVxuXG4gIH1cblxuICBfZmFpbChlcnJSZXN1bHQpIHtcbiAgICBpZiAodGhpcy5fZmFpbEZ1bmMpIHtcbiAgICAgIHRoaXMuX2ZhaWxGdW5jKGVyclJlc3VsdC5kYXRhLCBlcnJSZXN1bHQucmVzcG9uc2UsIGVyclJlc3VsdC5jYXVzZSwgZXJyUmVzdWx0LmVycik7XG4gICAgfVxuICB9XG5cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtBamF4Q2xpZW50fSBmcm9tIFwiLi9BamF4Q2xpZW50LmpzXCI7XG5pbXBvcnQge0FqYXhDbGllbnQyfSBmcm9tIFwiLi9BamF4Q2xpZW50Mi5qc1wiO1xuXG5leHBvcnQge0FqYXhDbGllbnQsIEFqYXhDbGllbnQyfTtcbiJdLCJuYW1lcyI6WyJBamF4Q2xpZW50IiwiY29uc3RydWN0b3IiLCJnZXRBc3luYyIsIm9wdGlvbnMiLCJ0eXBlIiwiYWpheCIsInBvc3RBc3luYyIsImdldCIsImNvbnRlbnRUeXBlIiwidHlwZU9mIiwiZGF0YSIsIm9iaiIsIkpTT04iLCJzdHJpbmdpZnkiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN1Y2Nlc3MiLCJ4aHIiLCJyZXNwb25zZSIsImVycm9yIiwiZSIsImNhdXNlIiwidGltZW91dCIsInBvc3QiLCJYTUxIdHRwUmVxdWVzdCIsIkVycm9yIiwidXJsIiwiQVNZTkMiLCJ0b0xvd2VyQ2FzZSIsIm9wZW4iLCJkYXRhVHlwZSIsInJlc3BvbnNlVHlwZSIsInNldFJlcXVlc3RIZWFkZXIiLCJoZWFkZXJzIiwia2V5IiwidmFsdWUiLCJ4aHJGaWVsZHMiLCJ3aXRoQ3JlZGVudGlhbHMiLCJ0aW1lb3V0TWlsbGlzIiwib25sb2FkIiwiZXZ0Iiwic3RhdHVzIiwicGFyc2UiLCJvbnRpbWVvdXQiLCJvbmVycm9yIiwic3RhcnRzV2l0aCIsImZuRW5jb2RlRm9ybSIsImZvcm1EYXRhIiwicGFyYW1zIiwibmFtZSIsInBhcmFtIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicHVzaCIsImpvaW4iLCJyZXBsYWNlIiwic2VuZCIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsInNsaWNlIiwiQWpheENsaWVudDIiLCJvcHQiLCJlcnIiLCJfY3JlYXRlVXJsIiwibWV0aG9kIiwicG9zdEJvZHkiLCJyZXFQYXJhbSIsImJvZHkiLCJhc3luY1Jlc3VsdCIsIl9oYW5kbGVEYXRhIiwiX2hhbmRsZUpzb25wIiwiX2dldEZldGNoUGFyYW0iLCJ0b1VwcGVyQ2FzZSIsImZldGNoUGFyYW0iLCJtb2RlIiwiY2FjaGUiLCJjcmVkZW50aWFscyIsInBhcmFtc0Zyb21Gb3JtRGF0YSIsInNlbGYiLCJBamF4UmVzdWx0IiwiZm5GZXRjaCIsImZldGNoIiwiZmV0Y2hQcm9taXNlIiwiZm5UaW1lb3V0IiwicHJvbWlzZSIsInJlamVjdCIsInNldFRpbWVvdXQiLCJ0aGVuIiwib2siLCJqc29uIiwianNvbkRhdGEiLCJjYXRjaCIsInRleHQiLCJ0ZXh0RGF0YSIsImNvbnNvbGUiLCJsb2ciLCJyZXN1bHQiLCJfc3VjY2VzcyIsImVyclJlc3VsdCIsIl9mYWlsIiwic2NyaXB0RWxlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2FsbGJhY2tGdW5jTmFtZSIsIl9jcmVhdGVVVUlEIiwic3JjIiwiaW5kZXhPZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJlcnJvck9iaiIsIndpbmRvdyIsInJlcyIsInBhcmVudEVsZSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiYXBwZW5kQ2hpbGQiLCJwYXJhbURhdGEiLCJwYXJhbUtleSIsImtleXMiLCJwYXJhbVZhbCIsInN1YnN0cmluZyIsImxlbmd0aCIsImRhdGVUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ1dWlkIiwiYyIsInIiLCJNYXRoIiwicmFuZG9tIiwiX3N1Y2Nlc3NGdW5jIiwiX2ZhaWxGdW5jIiwiZG9uZSIsImNhbGxiYWNrRnVuYyIsImZhaWwiLCJzdWNjZXNzUmVzdWx0Il0sInNvdXJjZVJvb3QiOiIifQ==