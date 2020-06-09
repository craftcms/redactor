var plugin = $.extend({}, Craft.Redactor.PluginBase, {
    linkOptions: [],
    existingText: '',
    hack: null,
    modalState: {
        selectedLink: {
            text: null,
            url: null
        }
    },

    // Do nothing on start.
    start: function () {

    },
    showModal: function (arguments, zIndex) {
        let refHandle = arguments.refHandle,
            callback = arguments.callback;

        this.saveSelection(this.app);

        // Create a new one each time because Redactor creates a new one and we can't reuse the references.
        const modal = Craft.createElementSelectorModal(arguments.elementType, {
            storageKey: 'RedactorInput.LinkTo.' + arguments.elementType,
            sources: arguments.sources,
            criteria: arguments.criteria,
            defaultSiteId: this.elementSiteId,
            autoFocusSearchBox: false,
            onSelect: $.proxy(function(elements) {
                if (elements.length) {
                    const element = elements[0];

                    this.restoreSelection(this.app);

                    this.modalState.selectedLink = {
                        url: element.url + '#' + refHandle + ':' + element.id + '@' + element.siteId,
                        text: this.app.selection.getText().length > 0 ? this.app.selection.getText() : element.label
                    }

                    this.app.api('module.link.open');
                }
            }, this),
            closeOtherModals: false,
        });
    },

    setLinkOptions: function (linkOptions) {
        this.linkOptions = linkOptions;
    },

    onmodal: {
        link: {
            open: function(modal, form) {
                // Prevent Redactor from aggressively refocusing, when we don't want it to.
                this.hack = modal.app.editor.focus;
                modal.app.editor.focus = () => null;

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

            },
            close: function (modal) {
                // Revert the functionality.
                modal.app.editor.focus = this.hack;
                this.hack = null;
            }
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
    }
});

(function($R) {
    $R.add('plugin', 'craftElementLinks', plugin);
})(Redactor);
