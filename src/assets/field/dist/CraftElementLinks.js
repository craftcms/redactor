/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************************!*\
  !*** ./js/CraftElementLinks.js ***!
  \*********************************/
var _$$extend;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var plugin = $.extend({}, Craft.Redactor.PluginBase, (_$$extend = {
  linkOptions: [],
  existingText: '',
  hack: null,
  allSites: {},
  modalState: {
    selectedLink: {
      text: null,
      url: null
    }
  },
  // Do nothing on start.
  start: function start() {},
  showModal: function showModal(args, zIndex) {
    var refHandle = args.refHandle,
        callback = args.callback;
    this.saveSelection(this.app); // Create a new one each time because Redactor creates a new one and we can't reuse the references.

    var modal = Craft.createElementSelectorModal(args.elementType, {
      storageKey: 'RedactorInput.LinkTo.' + args.elementType,
      sources: args.sources,
      criteria: args.criteria,
      defaultSiteId: this.elementSiteId,
      autoFocusSearchBox: false,
      onSelect: $.proxy(function (elements) {
        if (elements.length) {
          this.restoreSelection(this.app);
          var element = elements[0];
          var selectedText = this.app.selection.getText();
          this.modalState.selectedLink = {
            url: element.url + '#' + refHandle + ':' + element.id + '@' + element.siteId,
            text: selectedText.length > 0 ? selectedText : element.label
          };
          this.app.api('module.link.open');
        }
      }, this),
      closeOtherModals: false
    });
  },
  setLinkOptions: function setLinkOptions(linkOptions) {
    this.linkOptions = linkOptions;
  },
  onmodal: {
    link: {
      open: function open(modal, form) {
        // Prevent Redactor from aggressively refocusing, when we don't want it to.
        this.hack = modal.app.editor.focus;

        modal.app.editor.focus = function () {
          return null;
        };

        $form = $(form.nodes);

        if (this.modalState.selectedLink.url) {
          $form.find('input[name=url]').val(this.modalState.selectedLink.url);
        }

        if (this.modalState.selectedLink.text) {
          $form.find('input[name=text]').val(this.modalState.selectedLink.text);
        }

        this.modalState.selectedLink = {
          text: null,
          url: null
        };
        var elementUrl = $form.find('input[name=url]').val(); // Only add site selector if it looks like an element reference link

        if (elementUrl.match(/#(category|entry|product):\d+/)) {
          var siteOptions = this.allSites;
          var selectedSite = 0;

          if (elementUrl.split('@').length > 1) {
            selectedSite = parseInt(elementUrl.split('@').pop(), 10);
          }

          var $select = $('<select id="modal-site-selector"></select>').on('change', function (ev) {
            var existingUrl = $form.find('input[name=url]').val();
            var selectedSiteId = parseInt($(ev.currentTarget).val(), 10);

            if (existingUrl.match(/.*(@\d+)$/)) {
              var urlParts = existingUrl.split('@');
              urlParts.pop();
              existingUrl = urlParts.join('@');
            }

            if (selectedSiteId) {
              existingUrl += '@' + selectedSiteId;
            }

            $form.find('input[name=url]').val(existingUrl);
          }.bind(this));
          var selected = selectedSite === 0 ? ' selected="selected"' : '';
          $select.append("<option value=\"0\"".concat(selected, ">Multisite</option>"));

          for (var _i = 0, _Object$entries = Object.entries(siteOptions); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2);

            siteId = _Object$entries$_i[0];
            siteName = _Object$entries$_i[1];

            var _selected = selectedSite === parseInt(siteId, 10) ? ' selected="selected"' : '';

            $select.append("<option value=\"".concat(siteId, "\"").concat(_selected, ">").concat(siteName, "</option>"));
          }

          var $formItem = $('<div class="form-item form-item-site"><label for="modal-site-selector">Site</label></div>').append($select);
          $(form.nodes[0]).append($formItem);
        }
      },
      close: function close(modal) {
        // Revert the functionality.
        modal.app.editor.focus = this.hack;
        this.hack = null;
      }
    }
  }
}, _defineProperty(_$$extend, "setLinkOptions", function setLinkOptions(linkOptions) {
  var button = this.app.toolbar.getButton('link'),
      dropdown = button.getDropdown(),
      items = dropdown.items,
      newList = {},
      counter = 0;

  for (var option in linkOptions) {
    option = linkOptions[option];
    newList['custom' + ++counter] = {
      title: option.optionTitle,
      api: 'plugin.craftElementLinks.showModal',
      args: {
        elementType: option.elementType,
        refHandle: option.refHandle,
        sources: option.sources,
        criteria: option.criteria
      }
    };
  }

  button.setDropdown($.extend(newList, items));
}), _defineProperty(_$$extend, "setAllSites", function setAllSites(allSites) {
  this.allSites = allSites;
}), _$$extend));

(function ($R) {
  $R.add('plugin', 'craftElementLinks', plugin);
})(Redactor);
/******/ })()
;
//# sourceMappingURL=CraftElementLinks.js.map