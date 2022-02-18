var plugin = $.extend({}, Craft.Redactor.PluginBase, {
    linkOptions: [],
    existingText: '',
    hack: null,
    allSites: {},
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

        const selectedText = this.app.selection.getText();
        this.app.selection.save();

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

                    this.app.selection.restore();

                    this.modalState.selectedLink = {
                        url: element.url + '#' + refHandle + ':' + element.id + '@' + element.siteId,
                        text: selectedText.length > 0 ? selectedText : element.label
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

                let elementUrl = $form.find('input[name=url]').val();

                // Only add site selector if it looks like an element reference link
                if (elementUrl.match(/#(category|entry|product):\d+/)) {
                    let siteOptions = this.allSites;
                    let selectedSite = 0;

                    if (elementUrl.split('@').length > 1) {
                        selectedSite = parseInt(elementUrl.split('@').pop(), 10);
                    }

                    const $select = $('<select id="modal-site-selector"></select>').on('change', function(ev) {
                        let existingUrl = $form.find('input[name=url]').val();
                        const selectedSiteId = parseInt($(ev.currentTarget).val(), 10);

                        if (existingUrl.match(/.*(@\d+)$/)) {
                            let urlParts = existingUrl.split('@');
                            urlParts.pop();
                            existingUrl = urlParts.join('@');
                        }

                        if (selectedSiteId) {
                            existingUrl += '@' + selectedSiteId;
                        }

                        $form.find('input[name=url]').val(existingUrl);
                    }.bind(this));

                    let selected = selectedSite === 0 ? ' selected="selected"' : '';
                    $select.append(`<option value="0"${selected}>Multisite</option>`);

                    for ([siteId, siteName] of Object.entries(siteOptions)) {
                        let selected = selectedSite === parseInt(siteId, 10) ? ' selected="selected"' : '';
                        $select.append(`<option value="${siteId}"${selected}>${siteName}</option>`);
                    }

                    const $formItem = $('<div class="form-item form-item-site"><label for="modal-site-selector">Site</label></div>').append($select);

                    $(form.nodes[0]).append($formItem);
                }
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
    },

    setAllSites: function (allSites) {
        this.allSites = allSites;
    },
});

(function($R) {
    $R.add('plugin', 'craftElementLinks', plugin);
})(Redactor);
