var plugin = $.extend({}, Craft.Redactor.PluginBase, {
  title: 'file',
  apiTarget: 'plugin.craftAssetFiles.showModal',
  icon: '<i class="re-icon-file"></i>',
  volumes: null,

  showModal: function () {
    this.saveSelection(this.app);

    if (typeof this.assetSelectionModal === 'undefined') {
      var refHandle = arguments.refHandle;
      this.assetSelectionModal = Craft.createElementSelectorModal(
        'craft\\elements\\Asset',
        {
          storageKey: 'RedactorInput.LinkToAsset',
          sources: this.volumes,
          criteria: {siteId: this.elementSiteId},
          onSelect: $.proxy(function (elements) {
            if (elements.length) {
              this.restoreSelection(this.app);
              const element = elements[0];
              const selectedText = this.app.selection.getText();
              const data = {
                url: element.url + '#asset:' + element.id,
                text: selectedText.length > 0 ? selectedText : element.label,
              };
              this.app.api('module.link.insert', data);
            }
          }, this),
          closeOtherModals: false,
        }
      );
    } else {
      this.assetSelectionModal.show();
    }
  },

  setVolumes: function (volumes) {
    this.volumes = volumes;
  },
});

(function ($R) {
  $R.add('plugin', 'craftAssetFiles', plugin);
})(Redactor);
