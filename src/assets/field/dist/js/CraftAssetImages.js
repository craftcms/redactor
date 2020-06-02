var plugin = $.extend({}, Craft.Redactor.PluginBase, {
    title: 'image',
    apiTarget: 'plugin.craftAssetImages.showModal',
    icon: '<i class="re-icon-image"></i>',
    transforms: [],
    volumes: null,
    allowAllUploaders: false,
    modalState: {
        selectedTransform: null
    },

    showModal: function () {
        if (this.app.selection.isCollapsed()) {
            this.app.selection.save();
            this.app.selectionMarkers = false;
        } else {
            this.app.selection.saveMarkers();
            this.app.selectionMarkers = true;
        }

        if (typeof this.assetSelectionModal === 'undefined') {
            const criteria = {
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
                onSelect: function(assets, transform) {
                    if (assets.length) {
                        if (this.app.selectionMarkers) {
                            this.app.selection.restoreMarkers();
                        } else {
                            this.app.selection.restore();
                        }

                        this.app.selectionMarkers = false;

                        const data = {};

                        for (var i = 0; i < assets.length; i++) {
                            const asset = assets[i];

                            data['asset'+asset.id] = {
                                url: this._buildAssetUrl(asset.id, asset.url, transform),
                                id: asset.id
                            };
                        }

                        this.app.api('module.image.insert', data);
                    }
                }.bind(this),
                closeOtherModals: false,
                transforms: this.transforms
            });

            let existingSelectFunction = this.assetSelectionModal.selectImagesWithTransform;
            this.assetSelectionModal.selectImagesWithTransform = function (transform) {
                this.$selectTransformBtn.html('Transform: ' + transform);
                debugger
                //existingSelectFunction.call(this, tran);
            }.bind(this.assetSelectionModal);
        } else {
            this.assetSelectionModal.show();
        }
    },

    setTransforms: function (transforms) {
        this.transforms = transforms;
    },

    setVolumes: function (volumes) {
        this.volumes = volumes;
    },

    _buildAssetUrl: (assetId, assetUrl, transform) => assetUrl + '#asset:' + assetId + ':' + (transform ? 'transform:' + transform : 'url'),

    _getAssetUrlComponents: (url) => {
        const matches = url.match(/(.*)#asset:(\d+):(url|transform):?([a-zA-Z][a-zA-Z0-9_]*)?/);
        return matches ? {url: matches[1], assetId: matches[2], transform: matches[3] !== 'url' ? matches[4] : null} : null;
    },

    onmodal: {
        imageedit: {
            open: function(modal, form) {
                this.modalState.selectedTransform = null;
                const parts = this._getAssetUrlComponents(this.app.module.image.$image.$element.nodes[0].src);

                if (!parts) {
                    return;
                }

                const {transform} = parts;
                this.modalState.selectedTransform = transform;
                let options = [{handle: '', name: "No transform"}].concat(this.transforms);

                const $select = $('<select id="modal-image-transform"></select>').on('change', function(ev) {
                    this.modalState.selectedTransform = $(ev.currentTarget).val();
                }.bind(this));

                for (optionIndex in options) {
                    let option = options[optionIndex];
                    let selected = transform && option.handle == transform;
                    $select.append('<option value="' + option.handle + '"' + (selected ? ' selected="selected"' : '') + '>' + option.name + '</option>');
                }

                const $formItem = $('<div class="form-item form-item-transform"><label for="modal-image-transform">Transform</label></div>').append($select);

                $(form.nodes[0]).append($formItem);
            },
        }
    },

    onimage :{
        changed: function(image)
        {
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
                var data = {
                    assetId: assetId,
                    handle: newTransform
                };

                Craft.postActionRequest('assets/generate-transform', data, function(response, textStatus) {
                    if (textStatus === 'success') {
                        if (response.url) {
                            $image.prop('src', this._buildAssetUrl(assetId, response.url, newTransform));
                            $image.stop().fadeTo(0, 1);
                        }
                    }

                }.bind(this));
            } else {
                let pattern = new RegExp('(.*)(_' + transform + '.*\/)(.*)');
                $image.prop('src', this._buildAssetUrl(assetId, url.replace(pattern, '$1$3'), newTransform));
                $image.stop().fadeTo(0, 1);
            }
        }
    }
});

(function($R) {
    $R.add('plugin', 'craftAssetImages', plugin);
})(Redactor);
