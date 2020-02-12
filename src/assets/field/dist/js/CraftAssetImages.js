var plugin = $.extend({}, Craft.Redactor.PluginBase, {
    title: 'image',
    apiTarget: 'plugin.craftAssetImages.showModal',
    icon: '<i class="re-icon-image"></i>',
    transforms: [],
    volumes: null,
    allowAllUploaders: false,

    showModal: function () {
        if (this.app.selection.isCollapsed()) {
            this.app.selection.save();
            this.app.selectionMarkers = false;
        } else {
            this.app.selection.saveMarkers();
            this.app.selectionMarkers = true;
        }

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
                onSelect: $.proxy(function(assets, transform) {
                    if (assets.length) {
                        if (this.app.selectionMarkers) {
                            this.app.selection.restoreMarkers();
                        } else {
                            this.app.selection.restore();
                        }

                        this.app.selectionMarkers = false;
                        var data = {};

                        for (var i = 0; i < assets.length; i++) {
                            var asset = assets[i],
                                url = asset.url + '#asset:' + asset.id;

                            if (transform) {
                                url += ':transform:' + transform;
                            }

                            data['asset'+asset.id] = {
                                url: url,
                                id: asset.id
                            };
                        }

                        this.app.api('module.image.insert', data);
                    }
                }, this),
                closeOtherModals: false,
                transforms: this.transforms
            });
        }
        else {
            this.assetSelectionModal.show();
        }
    },

    setTransforms: function (transforms) {
        this.transforms = transforms;
    },

    setVolumes: function (volumes) {
        this.volumes = volumes;
    }
});

(function($R) {
    $R.add('plugin', 'craftAssetImages', plugin);
})(Redactor);
