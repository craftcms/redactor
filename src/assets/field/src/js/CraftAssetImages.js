var plugin = $.extend({}, Craft.Redactor.PluginBase, {
  title: 'image',
  apiTarget: 'plugin.craftAssetImages.showModal',
  icon: '<i class="re-icon-image"></i>',
  transforms: [],
  volumes: null,
  allowAllUploaders: false,
  defaultTransform: '',
  modalState: {
    selectedTransform: null,
  },

  showModal: function () {
    this.saveSelection(this.app);

    if (typeof this.assetSelectionModal === 'undefined') {
      const criteria = {
        siteId: this.elementSiteId,
        kind: 'image',
      };

      if (this.allowAllUploaders) {
        criteria.uploaderId = null;
      }

      this.assetSelectionModal = Craft.createElementSelectorModal(
        'craft\\elements\\Asset',
        {
          storageKey: 'RedactorInput.ChooseImage',
          multiSelect: true,
          sources: this.volumes,
          criteria: criteria,
          onSelect: function (assets, transform) {
            if (assets.length) {
              this.restoreSelection(this.app);

              const data = {};
              const isMulti = assets.length > 1;

              const processAssetUrls = function (assets, callback) {
                const asset = assets.pop();
                const isTransform = this._isTransformUrl(asset.url);

                // If transform was selected or we don't have a default, no _real_ processing.
                if (isTransform || this.defaultTransform.length == 0) {
                  data['asset' + asset.id] = {
                    url: this._buildAssetUrl(
                      asset.id,
                      asset.url,
                      isTransform ? transform : this.defaultTransform
                    ),
                    id: asset.id,
                  };

                  if (assets.length) {
                    processAssetUrls(assets, callback);
                  } else {
                    callback();
                  }
                  // Otherwise, get the transform url for the default transform.
                } else {
                  let url = this._getTransformUrl(
                    asset.id,
                    this.defaultTransform,
                    function (url) {
                      data['asset' + asset.id] = {
                        url: this._buildAssetUrl(
                          asset.id,
                          url,
                          this.defaultTransform
                        ),
                        id: asset.id,
                      };

                      if (assets.length) {
                        processAssetUrls(assets, callback);
                      } else {
                        callback();
                      }
                    }.bind(this)
                  );
                }
              }.bind(this);

              processAssetUrls(
                assets,
                function () {
                  this.app.api('module.image.insert', data);

                  // If single asset selected, show the image modal.
                  if (!isMulti) {
                    this.modalState.selectedTransform = this.defaultTransform;
                    this.app.api('module.image.open');
                  }
                }.bind(this)
              );
            }
          }.bind(this),
          transforms: this.transforms,
          closeOtherModals: false,
        }
      );
    } else {
      this.assetSelectionModal.show();
    }
  },

  setTransforms: function (transforms) {
    this.transforms = transforms;
  },

  setDefaultTransform: function (transform) {
    this.defaultTransform = transform;
  },

  setVolumes: function (volumes) {
    this.volumes = volumes;
  },

  _buildAssetUrl: (assetId, assetUrl, transform) =>
    assetUrl +
    '#asset:' +
    assetId +
    ':' +
    (transform ? 'transform:' + transform : 'url'),

  _removeTransformFromUrl: (url) =>
    url.replace(/(^|\/)(_[^\/]+\/)([^\/]+)$/, '$1$3'),

  _isTransformUrl: (url) => /(^|\/)_[^\/]+\/[^\/]+$/.test(url),

  _getTransformUrl: function (assetId, handle, callback) {
    var data = {
      assetId: assetId,
      handle: handle,
    };

    Craft.sendActionRequest('POST', 'assets/generate-transform', {data})
      .then((response) => {
        const url = response.data && response.data.url;
        if (url) {
          callback(url);
        }
      })
      .catch(({response}) => {
        alert('There was an error generating the transform URL.');
      });
  },

  _getAssetUrlComponents: (url) => {
    const matches = url.match(
      /(.*)#asset:(\d+):(url|transform):?([a-zA-Z][a-zA-Z0-9_]*)?/
    );
    return matches
      ? {
          url: matches[1],
          assetId: matches[2],
          transform: matches[3] !== 'url' ? matches[4] : null,
        }
      : null;
  },

  onmodal: {
    imageedit: {
      open: function (modal, form) {
        this.registerCmdS(
          () => {
            // Seems to be the simplest way.
            const imageModule = this.app.module.image;
            const modalModule = this.app.module.modal;
            imageModule._save(modalModule.$modal, modalModule.$modalForm);
          },
          () => {
            this.app.api('module.modal.close');
          }
        );

        const parts = this._getAssetUrlComponents(
          this.app.module.image.$image.$element.nodes[0].src
        );

        if (!parts) {
          return;
        }

        let {transform} = parts;

        if (!transform || !transform.length) {
          transform = this.defaultTransform;
        } else {
          this.modalState.selectedTransform = transform;
        }

        const options = [{handle: '', name: 'No transform'}].concat(
          this.transforms
        );

        const $select = $('<select id="modal-image-transform"></select>').on(
          'change',
          function (ev) {
            this.modalState.selectedTransform = $(ev.currentTarget).val();
          }.bind(this)
        );

        for (optionIndex in options) {
          let option = options[optionIndex];
          let selected = transform && option.handle == transform;
          $select.append(
            '<option value="' +
              option.handle +
              '"' +
              (selected ? ' selected="selected"' : '') +
              '>' +
              option.name +
              '</option>'
          );
        }

        const $formItem = $(
          '<div class="form-item form-item-transform"><label for="modal-image-transform">Transform</label></div>'
        ).append($select);

        $(form.nodes[0]).append($formItem);
      },

      close: function () {
        Garnish.shortcutManager.removeLayer();
      },
    },
  },

  onimage: {
    changed: function (image) {
      const $image = $(image.$element.nodes[0]);
      const parts = this._getAssetUrlComponents($image.attr('src'));
      const newTransform = this.modalState.selectedTransform;

      if (!parts) {
        return;
      }

      const {transform, assetId, url} = parts;

      if (transform == newTransform) {
        return;
      }

      $image.fadeTo(100, 0.2);

      if (newTransform.length) {
        this._getTransformUrl(
          assetId,
          newTransform,
          function (url) {
            $image.prop('src', this._buildAssetUrl(assetId, url, newTransform));
            $image.stop().fadeTo(0, 1);
          }.bind(this)
        );
      } else {
        const pattern = new RegExp('(.*)(_' + transform + '.*/)(.*)');
        $image.prop(
          'src',
          this._buildAssetUrl(
            assetId,
            this._removeTransformFromUrl(url),
            newTransform
          )
        );
        $image.stop().fadeTo(0, 1);
      }
    },
  },
});

(function ($R) {
  $R.add('plugin', 'craftAssetImages', plugin);
})(Redactor);
