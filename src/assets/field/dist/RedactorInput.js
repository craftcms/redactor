/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../../../node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[3].use[1]!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[3].use[3]!../../../../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[4]!./css/RedactorInput.scss":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../../../node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[3].use[1]!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[3].use[3]!../../../../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[4]!./css/RedactorInput.scss ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ (() => {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./css/RedactorInput.scss":
/*!********************************!*\
  !*** ./css/RedactorInput.scss ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !!../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[3].use[1]!../../../../../node_modules/css-loader/dist/cjs.js!../../../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[3].use[3]!../../../../../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[4]!./RedactorInput.scss */ "../../../../node_modules/mini-css-extract-plugin/dist/loader.js??ruleSet[1].rules[3].use[1]!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[3].use[3]!../../../../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[4]!./css/RedactorInput.scss");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(/*! !../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "../../../../node_modules/vue-style-loader/lib/addStylesClient.js")["default"])
var update = add("e09d0bc8", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "../../../../node_modules/vue-style-loader/lib/addStylesClient.js":
/*!************************************************************************!*\
  !*** ../../../../node_modules/vue-style-loader/lib/addStylesClient.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addStylesClient)
/* harmony export */ });
/* harmony import */ var _listToStyles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./listToStyles */ "../../../../node_modules/vue-style-loader/lib/listToStyles.js");
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = (0,_listToStyles__WEBPACK_IMPORTED_MODULE_0__["default"])(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = (0,_listToStyles__WEBPACK_IMPORTED_MODULE_0__["default"])(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "../../../../node_modules/vue-style-loader/lib/listToStyles.js":
/*!*********************************************************************!*\
  !*** ../../../../node_modules/vue-style-loader/lib/listToStyles.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listToStyles)
/* harmony export */ });
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************!*\
  !*** ./js/RedactorInput.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_RedactorInput_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/RedactorInput.scss */ "./css/RedactorInput.scss");
/* harmony import */ var _css_RedactorInput_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_RedactorInput_scss__WEBPACK_IMPORTED_MODULE_0__);
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }


window.livePreviewHideFullscreen = false;

(function ($) {
  /** global: Craft */

  /** global: Garnish */

  /**
   * Redactor input class
   */
  Craft.RedactorInput = Garnish.Base.extend({
    id: null,
    linkOptions: null,
    volumes: null,
    elementSiteId: null,
    allSites: {},
    redactorConfig: null,
    showAllUploaders: false,
    $textarea: null,
    redactor: null,
    linkOptionModals: null,
    enforceButtonOrder: null,
    init: function init(settings) {
      this.id = settings.id;
      this.linkOptions = settings.linkOptions;
      this.volumes = settings.volumes;
      this.transforms = settings.transforms;
      this.elementSiteId = settings.elementSiteId;
      this.allSites = settings.allSites;
      this.redactorConfig = settings.redactorConfig;
      this.showAllUploaders = settings.showAllUploaders;
      this.defaultTransform = settings.defaultTransform;
      this.linkOptionModals = [];

      if (this.redactorConfig.enforceButtonOrder) {
        this.enforceButtonOrder = this.redactorConfig.enforceButtonOrder;
        delete this.redactorConfig.enforceButtonOrder;
      }

      if (!this.redactorConfig.lang) {
        this.redactorConfig.lang = settings.redactorLang;
      }

      if (!this.redactorConfig.direction) {
        this.redactorConfig.direction = settings.direction || Craft.orientation;
      }

      this.redactorConfig.imageUpload = false;
      this.redactorConfig.fileUpload = false; // Prevent a JS error when calling core.destroy() when opts.plugins == false

      if (_typeof(this.redactorConfig.plugins) !== _typeof([])) {
        this.redactorConfig.plugins = [];
      }

      this.redactorConfig.plugins.push('craftAssetImages');
      this.redactorConfig.plugins.push('craftAssetFiles');
      this.redactorConfig.plugins.push('craftElementLinks');
      this.redactorConfig.plugins.push('craftAssetImageEditor'); // Redactor I/II config setting normalization

      if (this.redactorConfig.buttons) {
        var index; // buttons.formatting => buttons.format

        if ((index = $.inArray('formatting', this.redactorConfig.buttons)) !== -1) {
          this.redactorConfig.buttons.splice(index, 1, 'format');
        } // buttons.unorderedlist/orderedlist/undent/indent => buttons.lists


        var oldListButtons = ['unorderedlist', 'orderedlist', 'undent', 'indent'],
            lowestListButtonIndex;

        for (var i = 0; i < oldListButtons.length; i++) {
          if ((index = $.inArray(oldListButtons[i], this.redactorConfig.buttons)) !== -1) {
            this.redactorConfig.buttons.splice(index, 1);

            if (typeof lowestListButtonIndex === 'undefined' || index < lowestListButtonIndex) {
              lowestListButtonIndex = index;
            }
          }
        }

        if (typeof lowestListButtonIndex !== 'undefined') {
          this.redactorConfig.buttons.splice(lowestListButtonIndex, 0, 'lists');
        }
      } else {
        this.redactorConfig.buttons = ['html', 'format', 'bold', 'italic', 'deleted', 'lists', 'image', 'file', 'link'];
      } // Now mix in the buttons provided by other options, before we start our own shenanigans
      // `buttonsAddFirst`


      if (this.redactorConfig.buttonsAddFirst) {
        this.redactorConfig.buttons = this.redactorConfig.buttonsAddFirst.buttons.concat(this.redactorConfig.buttons);
      } // `buttonsAdd`


      if (this.redactorConfig.buttonsAdd) {
        this.redactorConfig.buttons = this.redactorConfig.buttons.concat(this.redactorConfig.buttonsAdd.buttons);
      } // `buttonsAddBefore`


      if (this.redactorConfig.buttonsAddBefore) {
        var index;

        for (i = 0; i < this.redactorConfig.buttons.length; i++) {
          if (this.redactorConfig.buttons[i] == this.redactorConfig.buttonsAddBefore.before) {
            var _this$redactorConfig$;

            (_this$redactorConfig$ = this.redactorConfig.buttons).splice.apply(_this$redactorConfig$, [i, 0].concat(_toConsumableArray(this.redactorConfig.buttonsAddBefore.buttons)));

            break;
          }
        }
      } // `buttonsAddAfter`


      if (this.redactorConfig.buttonsAddAfter) {
        var index;

        for (i = 0; i < this.redactorConfig.buttons.length; i++) {
          if (this.redactorConfig.buttons[i] == this.redactorConfig.buttonsAddAfter.after) {
            var _this$redactorConfig$2;

            (_this$redactorConfig$2 = this.redactorConfig.buttons).splice.apply(_this$redactorConfig$2, [i + 1, 0].concat(_toConsumableArray(this.redactorConfig.buttonsAddAfter.buttons)));

            break;
          }
        }
      }

      delete this.redactorConfig.buttonsAddFirst;
      delete this.redactorConfig.buttonsAddBefore;
      delete this.redactorConfig.buttonsAddAfter;
      delete this.redactorConfig.buttonsAdd; // Define our callbacks

      this.redactorConfig.callbacks = {
        started: Craft.RedactorInput.handleRedactorInit,
        focus: this.onEditorFocus.bind(this),
        blur: this.onEditorBlur.bind(this),
        contextbar: this.showContextBar.bind(this)
      };

      if (this.redactorConfig.buttons.length === 0) {
        delete this.redactorConfig.buttons;
      } // Initialize Redactor


      this.initRedactor();

      if (typeof Craft.Slideout !== 'undefined') {
        Garnish.on(Craft.Slideout, 'open', function () {
          return $('body').addClass('redactor-element-editor-open');
        });
        Garnish.on(Craft.Slideout, 'close', function () {
          return $('body').removeClass('redactor-element-editor-open');
        });
      }
    },
    initRedactor: function initRedactor() {
      var selector = '#' + this.id;
      this.$textarea = $(selector);

      if (typeof this.redactorConfig.toolbarFixed === 'undefined' || this.redactorConfig.toolbarFixed) {
        // Set the toolbarFixedTarget depending on the context
        var target = this.$textarea.closest('#content');

        if (target.length) {
          this.redactorConfig.toolbarFixedTarget = target;
        }
      }

      Craft.RedactorInput.currentInstance = this; // this.$textarea.redactor(this.redactorConfig);

      this.redactor = $R(selector, this.redactorConfig);

      if (typeof this.redactorConfig.buttons === 'undefined') {
        this.redactorConfig.buttons = [];
      }

      var toolbarButtons = this.redactor.toolbar.getButtonsKeys();

      if (this.redactorConfig.buttons.indexOf('image') !== -1) {
        if (toolbarButtons.indexOf('image') !== -1) {
          this.redactor.plugin.craftAssetImages.overrideButton('image');
        } else {
          this.redactor.plugin.craftAssetImages.addButton('image', this.redactorConfig.buttons.indexOf('image'));
        }

        this.redactor.plugin.craftAssetImages.setTransforms(this.transforms);
        this.redactor.plugin.craftAssetImages.setDefaultTransform(this.defaultTransform);
        this.redactor.plugin.craftAssetImages.setVolumes(this.volumes);
        this.redactor.plugin.craftAssetImages.setElementSiteId(this.elementSiteId);
        this.redactor.plugin.craftAssetImages.allowAllUploaders = this.showAllUploaders;
      }

      if (this.redactorConfig.buttons.indexOf('file') !== -1) {
        if (toolbarButtons.indexOf('file') !== -1) {
          this.redactor.plugin.craftAssetFiles.overrideButton('file');
        } else {
          this.redactor.plugin.craftAssetFiles.addButton('file', this.redactorConfig.buttons.indexOf('file'));
        }

        this.redactor.plugin.craftAssetFiles.setVolumes(this.volumes);
        this.redactor.plugin.craftAssetFiles.setElementSiteId(this.elementSiteId);
      }

      if (toolbarButtons.indexOf('link') !== -1) {
        this.redactor.plugin.craftElementLinks.setElementSiteId(this.elementSiteId);
        this.redactor.plugin.craftElementLinks.setAllSites(this.allSites);

        if (this.linkOptions.length) {
          this.redactor.plugin.craftElementLinks.setLinkOptions(this.linkOptions);
        }
      }

      if (this.redactorConfig.plugins.indexOf('fullscreen') !== -1 && typeof Craft.livePreview != 'undefined' && window.livePreviewHideFullscreen === false) {
        window.livePreviewHideFullscreen = true;
        Craft.livePreview.on('beforeEnter', function (ev) {
          $('a.re-button.re-fullscreen').addClass('hidden');
        });
        Craft.livePreview.on('beforeExit', function (ev) {
          $('a.re-button.re-fullscreen').removeClass('hidden');
        });
      }

      this.trigger('afterInitializeRedactor', {
        inputField: this
      });

      if (this.enforceButtonOrder) {
        var desiredOrder = this.enforceButtonOrder;
        var $toolbar = $(this.redactor.toolbar.getElement().nodes);

        if (desiredOrder.length > 0) {
          var index = 0; // Reverse the desired order, so we can prepend them.
          // The other option was to leave the order and append them, but this better addresses an edge case
          // Where not all buttons and plugin buttons are defined in the enforced button order.

          var _iterator = _createForOfIteratorHelper(desiredOrder.reverse()),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var buttonName = _step.value;
              var $existing = $toolbar.find("[data-re-name=".concat(buttonName, "]"));

              if ($existing.length > 0) {
                $toolbar.prepend($existing);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }

      delete Craft.RedactorInput.currentInstance;
    },
    onInitRedactor: function onInitRedactor(redactor) {
      this.redactor = redactor; // Add the .focusable-input class for Craft.CP

      this.redactor.container.getElement().addClass('focusable-input');
      this.leaveFullscreenOnSaveShortcut();

      if (this.redactor.opts.toolbarFixed && !Craft.RedactorInput.scrollPageOnReady) {
        Garnish.$doc.ready(function () {
          Garnish.$doc.trigger('scroll');
        });
        Craft.RedactorInput.scrollPageOnReady = true;
      }
    },
    onEditorFocus: function onEditorFocus() {
      this.redactor.container.getElement().trigger('focus');
    },
    onEditorBlur: function onEditorBlur() {
      this.redactor.container.getElement().trigger('blur');
    },
    leaveFullscreenOnSaveShortcut: function leaveFullscreenOnSaveShortcut() {
      if (typeof this.redactor.plugin.fullscreen !== 'undefined' && typeof this.redactor.plugin.fullscreen.close === 'function') {
        Craft.cp.on('beforeSaveShortcut', $.proxy(function () {
          if (this.redactor.plugin.fullscreen.isOpen) {
            this.redactor.plugin.fullscreen.close();
          }
        }, this));
      }
    },
    replaceRedactorButton: function replaceRedactorButton(key, title) {
      var previousButton = this.redactor.toolbar.getButton(key); // Ignore if the button isn't in use

      if (!previousButton) {
        return;
      }

      var icon = previousButton.$icon.get(0);
      var placeholderKey = key + '_placeholder';
      var placeholder = this.redactor.toolbar.addButtonAfter(key, placeholderKey, {
        title: title
      });
      previousButton.remove(); // Create the new button

      var button = this.redactor.toolbar.addButtonAfter(placeholderKey, key, {
        title: title
      });
      placeholder.remove();
      button.setIcon(icon);
      return button;
    },
    showContextBar: function showContextBar(e, contextbar) {
      if (this.justResized) {
        this.justResized = false;
        return;
      }

      var current = this.redactor.selection.getCurrent();
      var data = this.redactor.inspector.parse(current);

      var repositionContextBar = function repositionContextBar(e, contextbar) {
        var parent = contextbar.$contextbar.parent();
        var top = e.clientY + contextbar.$contextbar.height() - 10 - parent.offset().top + (contextbar.livePreview ? parent.scrollTop() : contextbar.$win.scrollTop());
        var left = e.clientX - contextbar.$contextbar.width() / 2 - parent.offset().left;
        var position = {
          left: left + 'px',
          top: top + 'px'
        };
        contextbar.$contextbar.css(position);
      };

      if (!data.isFigcaption() && data.isComponentType('image')) {
        var node = data.getComponent();
        var $img = $(node).find('img');

        if ($img.length === 1) {
          var matches = matches = $img.attr('src').match(/#asset:(\d+)/i);

          if (matches) {
            var assetId = matches[1];
            Craft.postActionRequest('redactor', {
              assetId: assetId
            }, function (data) {
              if (data.success) {
                var buttons = {
                  'image-editor': {
                    title: this.redactor.lang.get('image-editor'),
                    api: 'plugin.craftAssetImageEditor.open',
                    args: assetId
                  },
                  edit: {
                    title: this.redactor.lang.get('edit'),
                    api: 'module.image.open'
                  },
                  remove: {
                    title: this.redactor.lang.get('delete'),
                    api: 'module.image.remove',
                    args: node
                  }
                };
                contextbar.set(e, node, buttons);
              }

              repositionContextBar(e, contextbar);
            }.bind(this));
          }
        }
      }

      repositionContextBar(e, contextbar);
    }
  }, {
    handleRedactorInit: function handleRedactorInit() {
      // `this` is the current Redactor instance.
      // `Craft.RedactorInput.currentInstance` is the current RedactorInput instance
      Craft.RedactorInput.currentInstance.onInitRedactor(this);
    }
  });
})(jQuery);
})();

/******/ })()
;
//# sourceMappingURL=RedactorInput.js.map