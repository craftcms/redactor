var plugin = $.extend({}, Craft.Redactor.PluginBase, {
    linkOptions: [],
    existingText: '',

    // Do nothing on start.
    start: function () {

    },
    showModal: function (arguments, zIndex) {
        let refHandle = arguments.refHandle,
            callback = arguments.callback;

        // Create a new one each time because Redactor creates a new one and we can't reuse the references.
        const modal = Craft.createElementSelectorModal(arguments.elementType, {
            storageKey: 'RedactorInput.LinkTo.' + arguments.elementType,
            sources: arguments.sources,
            criteria: arguments.criteria,
            defaultSiteId: this.elementSiteId,
            onSelect: $.proxy(function(elements) {
                if (elements.length) {
                    let element = elements[0],
                        data = {
                            url: element.url + '#' + refHandle + ':' + element.id + '@' + element.siteId,
                            text: this.existingText.length > 0 ? this.existingText : element.label
                        };

                    this.temporary =
                    callback(data);
                }
            }, this),
            closeOtherModals: false,
        });
       
        modal.$shade.css('zIndex', zIndex + 1);
        modal.$container.css('zIndex', zIndex + 2);
    },

    setLinkOptions: function (linkOptions) {
        this.linkOptions = linkOptions;
    },

    onmodal: {
        link: {
            open: function(modal, form) {
                const zIndex = $(modal.nodes).css('zIndex'),
                    $form = $(form.nodes),
                    $formItem = $('<div class="form-item form-item-link-select"><label>Pick a link</label></div>');

                this.existingText = $form.find('input[name=text]').val();

                for (let idx in this.linkOptions) {
                    let option = this.linkOptions[idx];
                    $('<div class="btn">' + option.optionTitle + '</div>').appendTo($formItem).on('click', function (ev) {
                        this.showModal({
                            elementType: option.elementType,
                            refHandle: option.refHandle,
                            sources: option.sources,
                            criteria: option.criteria,
                            callback: (data) => {
                                $form.find('input[name=url]').val(data.url);
                                $form.find('input[name=text]').val(data.text);
                            }
                        }, zIndex);
                    }.bind(this));
                }

                $form.prepend($formItem);
            }
        }
    }
});

(function($R) {
    $R.add('plugin', 'craftElementLinks', plugin);
})(Redactor);
