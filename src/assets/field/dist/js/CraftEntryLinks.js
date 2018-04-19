var plugin = $.extend({}, Craft.Redactor.PluginBase, {

    // Do nothing on start.
    start: function () {

    },
    showModal: function (arguments) {
        this.app.selection.save();

        var modalProperty = 'selectionModal_'+arguments.refHandle;
        if (typeof this[modalProperty] === 'undefined') {
            var refHandle = arguments.refHandle;
            this[modalProperty] = Craft.createElementSelectorModal(arguments.elementType, {
                storageKey: 'RedactorInput.LinkTo.' + arguments.elementType,
                sources: arguments.sources,
                criteria: $.extend({siteId: this.elementSiteId}, arguments.criteria),
                onSelect: $.proxy(function(elements) {
                    if (elements.length) {
                        this.app.selection.restore();
                        var element = elements[0],
                            selection = this.app.selection.getText(),
                            data = {
                                url: element.url + '#' + refHandle + ':' + element.id,
                                text: selection.length > 0 ? selection : element.label
                            };
                        this.app.api('module.link.insert', data);
                    }
                }, this),
                closeOtherModals: false,
            });
        }
        else {
            this[modalProperty].show();
        }
    },

    setLinkOptions: function (linkOptions) {
        var button = this.app.toolbar.getButton('link'),
            dropdown = button.getDropdown(),
            items = dropdown.items,
            newList = {},
            counter = 0;


        for (var option in linkOptions) {
            option = linkOptions[option];
            newList['custom'+(++counter)] = {
                title: option.optionTitle,
                api: 'plugin.craftEntryLinks.showModal',
                args: {
                    elementType: option.elementType,
                    refHandle: option.refHandle,
                    sources: option.sources,
                    criteria: option.criteria
                }
            };
        }

        button.setDropdown($.extend(newList, items));
    }
});

(function($R) {
    $R.add('plugin', 'craftEntryLinks', plugin);
})(Redactor);