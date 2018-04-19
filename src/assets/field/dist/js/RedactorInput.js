(function($) {
    /** global: Craft */
    /** global: Garnish */
    /**
     * Redactor input class
     */
    Craft.RedactorInput = Garnish.Base.extend(
        {
            id: null,
            linkOptions: null,
            volumes: null,
            elementSiteId: null,
            redactorConfig: null,

            $textarea: null,
            redactor: null,
            linkOptionModals: null,

            init: function(settings) {
                this.id = settings.id;
                this.linkOptions = settings.linkOptions;
                this.volumes = settings.volumes;
                this.transforms = settings.transforms;
                this.elementSiteId = settings.elementSiteId;
                this.redactorConfig = settings.redactorConfig;

                this.linkOptionModals = [];

                if (!this.redactorConfig.lang) {
                    this.redactorConfig.lang = settings.redactorLang;
                }

                if (!this.redactorConfig.direction) {
                    this.redactorConfig.direction = (settings.direction || Craft.orientation);
                }

                this.redactorConfig.imageUpload = true;
                this.redactorConfig.fileUpload = true;
                this.redactorConfig.dragImageUpload = false;
                this.redactorConfig.dragFileUpload = false;

                // Prevent a JS error when calling core.destroy() when opts.plugins == false
                if (typeof this.redactorConfig.plugins !== typeof []) {
                    this.redactorConfig.plugins = [];
                }

                this.redactorConfig.plugins.push('craftAssetImages');
                this.redactorConfig.plugins.push('craftAssetFiles');
                this.redactorConfig.plugins.push('craftEntryLinks');

                // Redactor I config setting normalization
                if (this.redactorConfig.buttons) {
                    var index;

                    // buttons.html => plugins.source
                    if ((index = $.inArray('html', this.redactorConfig.buttons)) !== -1) {
                        this.redactorConfig.buttons.splice(index, 1);
                        this.redactorConfig.plugins.unshift('source');
                    }

                    // buttons.formatting => buttons.format
                    if ((index = $.inArray('formatting', this.redactorConfig.buttons)) !== -1) {
                        this.redactorConfig.buttons.splice(index, 1, 'format');
                    }

                    // buttons.unorderedlist/orderedlist/undent/indent => buttons.lists
                    var oldListButtons = ['unorderedlist', 'orderedlist', 'undent', 'indent'],
                        lowestListButtonIndex;

                    for (var i = 0; i < oldListButtons.length; i++) {
                        if ((index = $.inArray(oldListButtons[i], this.redactorConfig.buttons)) !== -1) {
                            this.redactorConfig.buttons.splice(index, 1);

                            if (typeof lowestListButtonIndex === 'undefined' || index < lowestListButtonIndex) {
                                lowestListButtonIndex = index;
                            }
                        }
                    }

                    if (typeof lowestListButtonIndex !== 'undefined') {
                        this.redactorConfig.buttons.splice(lowestListButtonIndex, 0, 'lists');
                    }
                }

                this.redactorConfig.callbacks = {
                    started: Craft.RedactorInput.handleRedactorInit
                };

                // Initialize Redactor
                this.initRedactor();

                if (typeof Craft.livePreview !== 'undefined') {
                    // There's a UI glitch if Redactor is in Code view when Live Preview is shown/hidden
                    Craft.livePreview.on('beforeEnter beforeExit', $.proxy(function() {
                        this.redactor.core.destroy();
                    }, this));

                    Craft.livePreview.on('enter slideOut', $.proxy(function() {
                        this.initRedactor();
                    }, this));
                }
            },

            mergeCallbacks: function(callback1, callback2) {
                return function() {
                    callback1.apply(this, arguments);
                    callback2.apply(this, arguments);
                };
            },

            initRedactor: function() {
                var selector = '#' + this.id;
                this.$textarea = $(selector);

                if (this.redactorConfig.toolbarFixed) {
                    // Set the toolbarFixedTarget depending on the context
                    var target = this.$textarea.closest('#content-container, .lp-editor');
                    if (target.length) {
                        this.redactorConfig.toolbarFixedTarget = target;
                    }
                }

                Craft.RedactorInput.currentInstance = this;
                this.$textarea.redactor(this.redactorConfig);

                this.redactor = $R(selector);
                this.redactor.plugin.craftAssetImages.overrideButton('image');
                this.redactor.plugin.craftAssetImages.setTransforms(this.transforms);
                this.redactor.plugin.craftAssetImages.setVolumes(this.volumes);
                this.redactor.plugin.craftAssetImages.setElementSiteId(this.elementSiteId);

                this.redactor.plugin.craftAssetFiles.overrideButton('file');
                this.redactor.plugin.craftAssetFiles.setVolumes(this.volumes);
                this.redactor.plugin.craftAssetFiles.setElementSiteId(this.elementSiteId);

                this.redactor.plugin.craftEntryLinks.setElementSiteId(this.elementSiteId);
                if (this.linkOptions.length) {
                    this.redactor.plugin.craftEntryLinks.setLinkOptions(this.linkOptions);
                }

                delete Craft.RedactorInput.currentInstance;
            },

            onInitRedactor: function(redactor) {
                this.redactor = redactor;

                // Add the .focusable-input class for Craft.CP
                this.redactor.container.getElement().addClass('focusable-input');

                // Only customize the toolbar if there is one,
                // otherwise we get a JS error due to redactor.$toolbar being undefined
                if (this.redactor.opts.toolbar) {
                    this.customizeToolbar();
                }

                this.leaveFullscreetOnSaveShortcut();
return;
                this.redactor.core.editor()
                    .on('focus', $.proxy(this, 'onEditorFocus'))
                    .on('blur', $.proxy(this, 'onEditorBlur'));

                if (this.redactor.opts.toolbarFixed && !Craft.RedactorInput.scrollPageOnReady) {
                    Garnish.$doc.ready(function() {
                        Garnish.$doc.trigger('scroll');
                    });

                    Craft.RedactorInput.scrollPageOnReady = true;
                }
            },

            customizeToolbar: function() {
                // Override the Image and File buttons?
                if (this.volumes.length) {
                    var imageBtn = this.replaceRedactorButton('image', this.redactor.lang.get('image')),
                        fileBtn = this.replaceRedactorButton('file', this.redactor.lang.get('file'));

                    if (imageBtn) {
                        imageBtn.$icon.on('cick', $.proxy(this, 'onImageButtonClick'));
                    }
return;
                    if (fileBtn) {
                        this.redactor.button.addCallback($fileBtn, $.proxy(this, 'onFileButtonClick'));
                    }
                }
                else {
                    // Image and File buttons aren't supported
                    this.redactor.button.remove('image');
                    this.redactor.button.remove('file');
                }

                // Override the Link button?
                if (this.linkOptions.length) {
                    var $linkBtn = this.replaceRedactorButton('link', this.redactor.lang.get('link'));

                    if ($linkBtn) {
                        var dropdownOptions = {};

                        for (var i = 0; i < this.linkOptions.length; i++) {
                            dropdownOptions['link_option' + i] = {
                                title: this.linkOptions[i].optionTitle,
                                func: $.proxy(this, 'onLinkOptionClick', i)
                            };
                        }

                        // Add the default Link options
                        $.extend(dropdownOptions, {
                            link: {
                                title: this.redactor.lang.get('link-insert'),
                                func: 'link.show',
                                observe: {
                                    element: 'a',
                                    in: {
                                        title: this.redactor.lang.get('link-edit')
                                    },
                                    out: {
                                        title: this.redactor.lang.get('link-insert')
                                    }
                                }
                            },
                            unlink: {
                                title: this.redactor.lang.get('unlink'),
                                func: 'link.unlink',
                                observe: {
                                    element: 'a',
                                    out: {
                                        attr: {
                                            'class': 'redactor-dropdown-link-inactive',
                                            'aria-disabled': true
                                        }
                                    }
                                }
                            }
                        });

                        this.redactor.button.addDropdown($linkBtn, dropdownOptions);
                    }
                }
            },

            onImageButtonClick: function() {
                this.redactor.selection.save();

                if (typeof this.assetSelectionModal === 'undefined') {
                    this.assetSelectionModal = Craft.createElementSelectorModal('craft\\elements\\Asset', {
                        storageKey: 'RedactorInput.ChooseImage',
                        multiSelect: true,
                        sources: this.volumes,
                        criteria: {siteId: this.elementSiteId, kind: 'image'},
                        onSelect: $.proxy(function(assets, transform) {
                            if (assets.length) {
                                this.redactor.selection.restore();
                                for (var i = 0; i < assets.length; i++) {
                                    var asset = assets[i],
                                        url = asset.url + '#asset:' + asset.id;

                                    if (transform) {
                                        url += ':transform:' + transform;
                                    }

                                    this.redactor.insert.node($('<' + this.redactor.opts.imageTag + '><img src="' + url + '" /></figure>')[0]);
                                    this.redactor.code.sync();
                                }
                                this.redactor.observe.images();
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

            onFileButtonClick: function() {
                this.redactor.selection.save();

                if (typeof this.assetLinkSelectionModal === 'undefined') {
                    this.assetLinkSelectionModal = Craft.createElementSelectorModal('craft\\elements\\Asset', {
                        storageKey: 'RedactorInput.LinkToAsset',
                        sources: this.volumes,
                        criteria: {siteId: this.elementSiteId},
                        onSelect: $.proxy(function(assets) {
                            if (assets.length) {
                                this.redactor.selection.restore();
                                var asset = assets[0],
                                    url = asset.url + '#asset:' + asset.id,
                                    selection = this.redactor.selection.text(),
                                    title = selection.length > 0 ? selection : asset.label;
                                this.redactor.insert.node($('<a href="' + url + '">' + title + '</a>')[0]);
                                this.redactor.code.sync();
                            }
                        }, this),
                        closeOtherModals: false,
                        transforms: this.transforms
                    });
                }
                else {
                    this.assetLinkSelectionModal.show();
                }
            },

            onLinkOptionClick: function(key) {
                this.redactor.selection.save();

                if (typeof this.linkOptionModals[key] === 'undefined') {
                    var settings = this.linkOptions[key];

                    this.linkOptionModals[key] = Craft.createElementSelectorModal(settings.elementType, {
                        storageKey: (settings.storageKey || 'RedactorInput.LinkTo.' + settings.elementType),
                        sources: settings.sources,
                        criteria: $.extend({siteId: this.elementSiteId}, settings.criteria),
                        onSelect: $.proxy(function(elements) {
                            if (elements.length) {
                                this.redactor.selection.restore();
                                var element = elements[0],
                                    url = element.url + '#' + settings.refHandle + ':' + element.id,
                                    selection = this.redactor.selection.text(),
                                    title = selection.length > 0 ? selection : element.label;
                                this.redactor.insert.node($('<a href="' + url + '">' + title + '</a>')[0]);
                                this.redactor.code.sync();
                            }
                        }, this),
                        closeOtherModals: false
                    });
                }
                else {
                    this.linkOptionModals[key].show();
                }
            },

            onEditorFocus: function() {
                this.redactor.core.box().addClass('focus');
                this.redactor.core.box().trigger('focus');
            },

            onEditorBlur: function() {
                this.redactor.core.box().removeClass('focus');
                this.redactor.core.box().trigger('blur');
            },

            leaveFullscreetOnSaveShortcut: function() {
                if (typeof this.redactor.fullscreen !== 'undefined' && typeof this.redactor.fullscreen.disable === 'function') {
                    Craft.cp.on('beforeSaveShortcut', $.proxy(function() {
                        if (this.redactor.fullscreen.isOpen) {
                            this.redactor.fullscreen.disable();
                        }
                    }, this));
                }
            },

            replaceRedactorButton: function(key, title) {
                // Ignore if the button isn't in use
                var allButtons = this.redactor.toolbar.getButtonsKeys();
                var currentButtonIndex = allButtons.indexOf(key);

                if (currentButtonIndex == -1) {
                    return;
                }

                var previousButton = this.redactor.toolbar.getButtonByIndex(allButtons.indexOf(key));
                var icon = previousButton.$icon.get(0);

                var placeholderKey = key+'_placeholder';
                var placeholder = this.redactor.toolbar.addButtonAfter(key, placeholderKey, {title: title});
                previousButton.remove();

                // Create the new button
                var button = this.redactor.toolbar.addButtonAfter(placeholderKey, key, {title: title});
                placeholder.remove();

                button.setIcon(icon);

                return button;
            }
        },
        {
            handleRedactorInit: function() {
                // `this` is the current Redactor instance.
                // `Craft.RedactorInput.currentInstance` is the current RedactorInput instance
                //Craft.RedactorInput.currentInstance.onInitRedactor(this);
            }
        });
})(jQuery);
