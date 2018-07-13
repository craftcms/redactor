var plugin = $.extend({}, Craft.Redactor.PluginBase, {
    title: 'file',
    apiTarget: 'plugin.craftAssetFiles.showModal',
    icon: '<i class="re-icon-file"></i>',
    volumes: null,

    showModal: function () {
        this.app.selection.save();

        if (typeof this.assetSelectionModal === 'undefined') {
            var refHandle = arguments.refHandle;
            this.assetSelectionModal = Craft.createElementSelectorModal('craft\\elements\\Asset', {
                storageKey: 'RedactorInput.LinkToAsset',
                sources: this.volumes,
                criteria: {siteId: this.elementSiteId},
                onSelect: $.proxy(function(elements) {
                    if (elements.length) {
                        this.app.selection.restore();
                        var element = elements[0],
                            selection = this.app.selection.getText(),
                            data = {
                                url: element.url + '#asset:' + element.id,
                                text: selection.length > 0 ? selection : element.label
                            };
                        this.app.api('module.link.insert', data);
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