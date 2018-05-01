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
                this.redactorConfig.plugins.push('craftAssetImageEditor');

                // Redactor I/II config setting normalization
                if (this.redactorConfig.buttons) {
                    var index;

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

                // Define our callbacks
                this.redactorConfig.callbacks = {
                    started: Craft.RedactorInput.handleRedactorInit,
                    focus: this.onEditorFocus.bind(this),
                    blur: this.onEditorBlur.bind(this),
                    contextbar: this.showContextBar.bind(this)
                };

                // Initialize Redactor
                this.initRedactor();
            },

            initRedactor: function() {
                var selector = '#' + this.id;
                this.$textarea = $(selector);

                if (typeof this.redactorConfig.toolbarFixed === 'undefined' || this.redactorConfig.toolbarFixed) {
                    // Set the toolbarFixedTarget depending on the context
                    var target = this.$textarea.closest('#content-container, .lp-editor');
                    if (target.length) {
                        this.redactorConfig.toolbarFixedTarget = target;
                    }
                }

                Craft.RedactorInput.currentInstance = this;
                this.$textarea.redactor(this.redactorConfig);

                this.redactor = $R(selector);

                var toolbarButtons = this.redactor.toolbar.getButtonsKeys();

                if (toolbarButtons.includes('image')) {
                    this.redactor.plugin.craftAssetImages.overrideButton('image');
                    this.redactor.plugin.craftAssetImages.setTransforms(this.transforms);
                    this.redactor.plugin.craftAssetImages.setVolumes(this.volumes);
                    this.redactor.plugin.craftAssetImages.setElementSiteId(this.elementSiteId);
                }

                if (toolbarButtons.includes('file')) {
                    this.redactor.plugin.craftAssetFiles.overrideButton('file');
                    this.redactor.plugin.craftAssetFiles.setVolumes(this.volumes);
                    this.redactor.plugin.craftAssetFiles.setElementSiteId(this.elementSiteId);
                }

                if (toolbarButtons.includes('link')) {
                    this.redactor.plugin.craftEntryLinks.setElementSiteId(this.elementSiteId);
                    
                    if (this.linkOptions.length) {
                        this.redactor.plugin.craftEntryLinks.setLinkOptions(this.linkOptions);
                    }
                }

                delete Craft.RedactorInput.currentInstance;
            },

            onInitRedactor: function(redactor) {

                this.redactor = redactor;

                // Add the .focusable-input class for Craft.CP
                this.redactor.container.getElement().addClass('focusable-input');

                this.leaveFullscreetOnSaveShortcut();

                if (this.redactor.opts.toolbarFixed && !Craft.RedactorInput.scrollPageOnReady) {
                    Garnish.$doc.ready(function() {
                        Garnish.$doc.trigger('scroll');
                    });

                    Craft.RedactorInput.scrollPageOnReady = true;
                }
            },

            onEditorFocus: function() {
                this.redactor.container.getElement().addClass('focus');
                this.redactor.container.getElement().trigger('focus');
            },

            onEditorBlur: function() {
                this.redactor.container.getElement().removeClass('focus');
                this.redactor.container.getElement().trigger('blur');
            },

            leaveFullscreetOnSaveShortcut: function() {
                if (typeof this.redactor.plugin.fullscreen !== 'undefined' && typeof this.redactor.plugin.fullscreen.close === 'function') {
                    Craft.cp.on('beforeSaveShortcut', $.proxy(function() {
                        if (this.redactor.plugin.fullscreen.isOpen) {
                            this.redactor.plugin.fullscreen.close();
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
            },

            showContextBar: function(e, contextbar) {
                if (this.justResized)
                {
                    this.justResized = false;
                    return;
                }

                var current = this.redactor.selection.getCurrent();
                var data = this.redactor.inspector.parse(current);

                var repositionContextBar = function (e, contextbar) {
                    var top = e.clientY - contextbar.$contextbar.height() - 10;
                    var left = e.clientX - contextbar.$contextbar.width() / 2;

                    var position = {
                        left: left + 'px',
                        top: top + 'px'
                    };

                    contextbar.$contextbar.css(position);
                };

                if (!data.isFigcaption() && data.isComponentType('image'))
                {
                    var node = data.getComponent();
                    var $img  = $(node).find('img');
                    if ($img.length === 1) {
                        var matches = matches = $img.attr('src').match(/#asset:(\d+)/i);
                        if (matches) {
                            var assetId = matches[1];
                            Craft.postActionRequest('redactor', {assetId: assetId}, function (data) {
                                if (data.success) {
                                    var buttons = {
                                        "image-editor": {
                                            title: this.redactor.lang.get('image-editor'),
                                            api: 'plugin.craftAssetImageEditor.open',
                                            args: assetId
                                        },
                                        "edit": {
                                            title: this.redactor.lang.get('edit'),
                                            api: 'module.image.open'
                                        },
                                        "remove": {
                                            title: this.redactor.lang.get('delete'),
                                            api: 'module.image.remove',
                                            args: node
                                        }
                                    };

                                    contextbar.set(e, node, buttons);
                                }

                                repositionContextBar(e, contextbar);
                            }.bind(this));
                        }
                    }

                }

                repositionContextBar(e, contextbar);
            }
        },
        {
            handleRedactorInit: function() {
                // `this` is the current Redactor instance.
                // `Craft.RedactorInput.currentInstance` is the current RedactorInput instance
                Craft.RedactorInput.currentInstance.onInitRedactor(this);
            }
        });
})(jQuery);
