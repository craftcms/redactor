/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./js/CraftAssetImages.js ***!
  \********************************/
var plugin = $.extend({}, Craft.Redactor.PluginBase, {
  title: 'image',
  apiTarget: 'plugin.craftAssetImages.showModal',
  icon: '<i class="re-icon-image"></i>',
  transforms: [],
  volumes: null,
  allowAllUploaders: false,
  defaultTransform: '',
  modalState: {
    selectedTransform: null
  },
  showModal: function showModal() {
    this.saveSelection(this.app);

    if (typeof this.assetSelectionModal === 'undefined') {
      var criteria = {
        siteId: this.elementSiteId,
        kind: 'image'
      };

      if (this.allowAllUploaders) {
        criteria.uploaderId = null;
      }

      this.assetSelectionModal = Craft.createElementSelectorModal('craft\\elements\\Asset', {
        storageKey: 'RedactorInput.ChooseImage',
        multiSelect: true,
        sources: this.volumes,
        criteria: criteria,
        onSelect: function (assets, transform) {
          if (assets.length) {
            this.restoreSelection(this.app);
            var data = {};
            var isMulti = assets.length > 1;

            var processAssetUrls = function (assets, callback) {
              var asset = assets.pop();

              var isTransform = this._isTransformUrl(asset.url); // If transform was selected or we don't have a default, no _real_ processing.


              if (isTransform || this.defaultTransform.length == 0) {
                data['asset' + asset.id] = {
                  url: this._buildAssetUrl(asset.id, asset.url, isTransform ? transform : this.defaultTransform),
                  id: asset.id
                };

                if (assets.length) {
                  processAssetUrls(assets, callback);
                } else {
                  callback();
                } // Otherwise, get the transform url for the default transform.

              } else {
                var url = this._getTransformUrl(asset.id, this.defaultTransform, function (url) {
                  data['asset' + asset.id] = {
                    url: this._buildAssetUrl(asset.id, url, this.defaultTransform),
                    id: asset.id
                  };

                  if (assets.length) {
                    processAssetUrls(assets, callback);
                  } else {
                    callback();
                  }
                }.bind(this));
              }
            }.bind(this);

            processAssetUrls(assets, function () {
              this.app.api('module.image.insert', data); // If single asset selected, show the image modal.

              if (!isMulti) {
                this.modalState.selectedTransform = this.defaultTransform;
                this.app.api('module.image.open');
              }
            }.bind(this));
          }
        }.bind(this),
        transforms: this.transforms,
        closeOtherModals: false
      });
    } else {
      this.assetSelectionModal.show();
    }
  },
  setTransforms: function setTransforms(transforms) {
    this.transforms = transforms;
  },
  setDefaultTransform: function setDefaultTransform(transform) {
    this.defaultTransform = transform;
  },
  setVolumes: function setVolumes(volumes) {
    this.volumes = volumes;
  },
  _buildAssetUrl: function _buildAssetUrl(assetId, assetUrl, transform) {
    return assetUrl + '#asset:' + assetId + ':' + (transform ? 'transform:' + transform : 'url');
  },
  _removeTransformFromUrl: function _removeTransformFromUrl(url) {
    return url.replace(/(.*)(_[a-z0-9+].*\/)(.*)/, '$1$3');
  },
  _isTransformUrl: function _isTransformUrl(url) {
    return /(.*)(_[a-z0-9+].*\/)(.*)/.test(url);
  },
  _getTransformUrl: function _getTransformUrl(assetId, handle, callback) {
    var data = {
      assetId: assetId,
      handle: handle
    };
    Craft.postActionRequest('assets/generate-transform', data, function (response, textStatus) {
      if (textStatus === 'success') {
        if (response.url) {
          callback(response.url);
        } else {
          alert('There was an error generating the transform URL.');
        }
      }
    });
  },
  _getAssetUrlComponents: function _getAssetUrlComponents(url) {
    var matches = url.match(/(.*)#asset:(\d+):(url|transform):?([a-zA-Z][a-zA-Z0-9_]*)?/);
    return matches ? {
      url: matches[1],
      assetId: matches[2],
      transform: matches[3] !== 'url' ? matches[4] : null
    } : null;
  },
  onmodal: {
    imageedit: {
      open: function open(modal, form) {
        var _this = this;

        this.registerCmdS(function () {
          // Seems to be the simplest way.
          var imageModule = _this.app.module.image;
          var modalModule = _this.app.module.modal;

          imageModule._save(modalModule.$modal, modalModule.$modalForm);
        }, function () {
          _this.app.api('module.modal.close');
        });

        var parts = this._getAssetUrlComponents(this.app.module.image.$image.$element.nodes[0].src);

        if (!parts) {
          return;
        }

        var transform = parts.transform;

        if (!transform || !transform.length) {
          transform = this.defaultTransform;
        } else {
          this.modalState.selectedTransform = transform;
        }

        var options = [{
          handle: '',
          name: 'No transform'
        }].concat(this.transforms);
        var $select = $('<select id="modal-image-transform"></select>').on('change', function (ev) {
          this.modalState.selectedTransform = $(ev.currentTarget).val();
        }.bind(this));

        for (optionIndex in options) {
          var option = options[optionIndex];
          var selected = transform && option.handle == transform;
          $select.append('<option value="' + option.handle + '"' + (selected ? ' selected="selected"' : '') + '>' + option.name + '</option>');
        }

        var $formItem = $('<div class="form-item form-item-transform"><label for="modal-image-transform">Transform</label></div>').append($select);
        $(form.nodes[0]).append($formItem);
      },
      close: function close() {
        Garnish.shortcutManager.removeLayer();
      }
    }
  },
  onimage: {
    changed: function changed(image) {
      var $image = $(image.$element.nodes[0]);

      var parts = this._getAssetUrlComponents($image.attr('src'));

      var newTransform = this.modalState.selectedTransform;

      if (!parts) {
        return;
      }

      var transform = parts.transform,
          assetId = parts.assetId,
          url = parts.url;

      if (transform == newTransform) {
        return;
      }

      $image.fadeTo(100, 0.2);

      if (newTransform.length) {
        this._getTransformUrl(assetId, newTransform, function (url) {
          $image.prop('src', this._buildAssetUrl(assetId, url, newTransform));
          $image.stop().fadeTo(0, 1);
        }.bind(this));
      } else {
        var pattern = new RegExp('(.*)(_' + transform + '.*/)(.*)');
        $image.prop('src', this._buildAssetUrl(assetId, this._removeTransformFromUrl(url), newTransform));
        $image.stop().fadeTo(0, 1);
      }
    }
  }
});

(function ($R) {
  $R.add('plugin', 'craftAssetImages', plugin);
})(Redactor);
/******/ })()
;
//# sourceMappingURL=CraftAssetImages.js.map