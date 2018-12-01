(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["riversun"] = factory();
	else
		root["org"] = root["org"] || {}, root["org"]["riversun"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/AjaxClient.js":
/*!***************************!*\
  !*** ./src/AjaxClient.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AjaxClient; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * AjaxClient
 * Simple XMLHttpRequest client.
 * Now supported 'post' method,dataType 'json'
 */
var AjaxClient =
/*#__PURE__*/
function () {
  function AjaxClient() {
    _classCallCheck(this, AjaxClient);
  }

  _createClass(AjaxClient, [{
    key: "postAsync",
    value: function postAsync(m) {
      //use XMLHttpRequest2 style
      var xhr = new XMLHttpRequest();

      if (!m.url) {
        console.error("Please specify url.");
        return;
      } //use async mode


      var ASYNC = true; //Supported only 'post' method by now.

      xhr.open('post', m.url, ASYNC); //Supported only 'json' method by now.

      if (m.dataType && m.dataType == 'json') {
        xhr.responseType = 'text';
      } else {
        console.error('Please specify dataType. Supported only "json" now.');
      }

      if (m.contentType) {
        xhr.setRequestHeader('Content-Type', m.contentType);
      } else {
        console.error('Please specify contentType.');
        return;
      } //Original headers


      if (m.headers) {
        for (var key in m.headers) {
          var value = m.headers[key];
          xhr.setRequestHeader(key, value);
        }
      }

      if (m.timeOutMillis) {
        xhr.timeout = m.timeOutMillis;
      }

      xhr.onload = function (evt) {
        if (xhr.status == 200) {
          if (m.dataType == 'json') {
            var data = JSON.parse(xhr.response);

            if (m.success) {
              m.success(data);
            }
          }
        } else {
          console.error("error:" + xhr.statusText);

          if (m.error) {
            m.error(evt);
          }
        }
      };

      if (m.timeout) {
        xhr.ontimeout = m.timeout;
      }

      if (m.error) {
        xhr.onerror = m.error;
      }

      if (m.data) {
        xhr.send(m.data);
      }
    }
  }]);

  return AjaxClient;
}();



/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: AjaxClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AjaxClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AjaxClient.js */ "./src/AjaxClient.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AjaxClient", function() { return _AjaxClient_js__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vcmcucml2ZXJzdW4vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL29yZy5yaXZlcnN1bi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vcmcucml2ZXJzdW4vLi9zcmMvQWpheENsaWVudC5qcyIsIndlYnBhY2s6Ly9vcmcucml2ZXJzdW4vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiQWpheENsaWVudCIsIm0iLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsInVybCIsImNvbnNvbGUiLCJlcnJvciIsIkFTWU5DIiwib3BlbiIsImRhdGFUeXBlIiwicmVzcG9uc2VUeXBlIiwiY29udGVudFR5cGUiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiaGVhZGVycyIsImtleSIsInZhbHVlIiwidGltZU91dE1pbGxpcyIsInRpbWVvdXQiLCJvbmxvYWQiLCJldnQiLCJzdGF0dXMiLCJkYXRhIiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2UiLCJzdWNjZXNzIiwic3RhdHVzVGV4dCIsIm9udGltZW91dCIsIm9uZXJyb3IiLCJzZW5kIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUMsQ0FBQ29CLElBQVg7QUFDSDtBQUVKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyRkw7QUFBQTtBQUFBO0FBQUEiLCJmaWxlIjoiYWpheGNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInJpdmVyc3VuXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIm9yZ1wiXSA9IHJvb3RbXCJvcmdcIl0gfHwge30sIHJvb3RbXCJvcmdcIl1bXCJyaXZlcnN1blwiXSA9IGZhY3RvcnkoKTtcbn0pKHdpbmRvdywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiLyoqXHJcbiAqIEFqYXhDbGllbnRcclxuICogU2ltcGxlIFhNTEh0dHBSZXF1ZXN0IGNsaWVudC5cclxuICogTm93IHN1cHBvcnRlZCAncG9zdCcgbWV0aG9kLGRhdGFUeXBlICdqc29uJ1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWpheENsaWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdEFzeW5jKG0pIHtcclxuXHJcbiAgICAgICAgLy91c2UgWE1MSHR0cFJlcXVlc3QyIHN0eWxlXHJcbiAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICAgIGlmICghbS51cmwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlBsZWFzZSBzcGVjaWZ5IHVybC5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdXNlIGFzeW5jIG1vZGVcclxuICAgICAgICBjb25zdCBBU1lOQyA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vU3VwcG9ydGVkIG9ubHkgJ3Bvc3QnIG1ldGhvZCBieSBub3cuXHJcbiAgICAgICAgeGhyLm9wZW4oJ3Bvc3QnLCBtLnVybCwgQVNZTkMpO1xyXG5cclxuICAgICAgICAvL1N1cHBvcnRlZCBvbmx5ICdqc29uJyBtZXRob2QgYnkgbm93LlxyXG4gICAgICAgIGlmIChtLmRhdGFUeXBlICYmIG0uZGF0YVR5cGUgPT0gJ2pzb24nKSB7XHJcbiAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAndGV4dCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignUGxlYXNlIHNwZWNpZnkgZGF0YVR5cGUuIFN1cHBvcnRlZCBvbmx5IFwianNvblwiIG5vdy4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtLmNvbnRlbnRUeXBlKSB7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBtLmNvbnRlbnRUeXBlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdQbGVhc2Ugc3BlY2lmeSBjb250ZW50VHlwZS4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9PcmlnaW5hbCBoZWFkZXJzXHJcbiAgICAgICAgaWYgKG0uaGVhZGVycykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbS5oZWFkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG0uaGVhZGVyc1trZXldO1xyXG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtLnRpbWVPdXRNaWxsaXMpIHtcclxuICAgICAgICAgICAgeGhyLnRpbWVvdXQgPSBtLnRpbWVPdXRNaWxsaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB4aHIub25sb2FkID0gZXZ0ID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChtLmRhdGFUeXBlID09ICdqc29uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG0uc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtLnN1Y2Nlc3MoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvcjpcIit4aHIuc3RhdHVzVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpZiAobS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG0uZXJyb3IoZXZ0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKG0udGltZW91dCkge1xyXG4gICAgICAgICAgICB4aHIub250aW1lb3V0ID0gbS50aW1lb3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG0uZXJyb3IpIHtcclxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBtLmVycm9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG0uZGF0YSkge1xyXG4gICAgICAgICAgICB4aHIuc2VuZChtLmRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBBamF4Q2xpZW50IH0gIGZyb20gJy4vQWpheENsaWVudC5qcyc7XHJcblxyXG4iXSwic291cmNlUm9vdCI6IiJ9