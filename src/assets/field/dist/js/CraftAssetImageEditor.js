var plugin = $.extend({}, Craft.Redactor.PluginBase, {

    assetId: null,

    start: function() {
    },

    open: function(assetId) {
        this.assetId = assetId;

        var settings = {
            allowSavingAsNew: false,
            onSave: this.reloadImage.bind(this),
            allowDegreeFractions: Craft.isImagick
        };

        new Craft.AssetImageEditor(assetId, settings);
    },

    reloadImage: function() {
        var $editor = this.app.editor.getElement();
        var $images = $editor.find('[data-image]');

        var refreshNodeSource = function(node) {
            var matches = node.src.match(/(.*)#asset:(\d+)(:transform:(.*))?/i);

            // Find all instances of THIS asset.
            if (matches && matches[2] == this.assetId) {
                // Not a transform
                if (!matches[4]) {
                    node.src = matches[1] + '?' + (new Date().getTime()) + '#asset:' + matches[2];
                } else {
                    var params = {
                        assetId: matches[2],
                        handle: matches[4]
                    };
                    Craft.postActionRequest('assets/generate-transform', params, function(data) {
                        node.src = data.url + '?' + (new Date().getTime()) + '#asset:' + matches[2] + ':transform:' + matches[4];
                    });
                }
            }
        }.bind(this);

        for (var node in $images.nodes) {
            node = $images.nodes[node];
            refreshNodeSource(node);
        }

        this.app.storage.observeImages();

    }
});

(function($R) {
    $R.add('plugin', 'craftAssetImageEditor', plugin);
})(Redactor);