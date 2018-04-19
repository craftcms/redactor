var plugin = $.extend({}, Craft.Redactor.PluginBase, {
    title: 'file',
    apiTarget: 'plugin.craftAssetFiles.showModal',
    icon: '<i class="re-icon-file"></i>',
    volumes: null,

    showModal: function () {
        this.app.selection.save();

        if (typeof this.assetSelectionModal === 'undefined') {
            this.assetSelectionModal = Craft.createElementSelectorModal('craft\\elements\\Asset', {
                storageKey: 'RedactorInput.LinkToAsset',
                sources: this.volumes,
                criteria: {siteId: this.elementSiteId},
                onSelect: $.proxy(function(assets, transform) {
                    if (assets.length) {
                        this.app.selection.restore();
                        for (var i = 0; i < assets.length; i++) {
                            var asset = assets[i],
                                url = asset.url + '#asset:' + asset.id,
                                data = {};

                            data['asset'+asset.id] = {
                                url: url,
                                id: asset.id,
                                name: asset.label
                            };

                            this.app.api('module.file.insert', data);
                        }
                    }
                }, this),
                closeOtherModals: false,
            });
        }
        else {
            this.assetSelectionModal.show();
        }
    },

    setVolumes: function (volumes) {
    this.volumes = volumes;
}
});

(function($R) {
    $R.add('plugin', 'craftAssetFiles', plugin);
})(Redactor);