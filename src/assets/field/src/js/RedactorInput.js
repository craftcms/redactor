import '../css/RedactorInput.scss';

window.livePreviewHideFullscreen = false;

(function ($) {
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
      allSites: {},
      redactorConfig: null,
      showAllUploaders: false,

      $textarea: null,
      redactor: null,
      linkOptionModals: null,

      enforceButtonOrder: null,

      init: function (settings) {
        this.id = settings.id;
        this.linkOptions = settings.linkOptions;
        this.volumes = settings.volumes;
        this.transforms = settings.transforms;
        this.elementSiteId = settings.elementSiteId;
        this.allSites = settings.allSites;
        this.redactorConfig = settings.redactorConfig;
        this.showAllUploaders = settings.showAllUploaders;
        this.defaultTransform = settings.defaultTransform;

        this.linkOptionModals = [];

        if (this.redactorConfig.enforceButtonOrder) {
          this.enforceButtonOrder = this.redactorConfig.enforceButtonOrder;
          delete this.redactorConfig.enforceButtonOrder;
        }

        if (!this.redactorConfig.lang) {
          this.redactorConfig.lang = settings.redactorLang;
        }

        if (!this.redactorConfig.direction) {
          this.redactorConfig.direction =
            settings.direction || Craft.orientation;
        }

        this.redactorConfig.imageUpload = false;
        this.redactorConfig.fileUpload = false;

        // Prevent a JS error when calling core.destroy() when opts.plugins == false
        if (typeof this.redactorConfig.plugins !== typeof []) {
          this.redactorConfig.plugins = [];
        }

        this.redactorConfig.plugins.push('craftAssetImages');
        this.redactorConfig.plugins.push('craftAssetFiles');
        this.redactorConfig.plugins.push('craftElementLinks');
        this.redactorConfig.plugins.push('craftAssetImageEditor');

        // Redactor I/II config setting normalization
        if (this.redactorConfig.buttons) {
          var index;

          // buttons.formatting => buttons.format
          if (
            (index = $.inArray('formatting', this.redactorConfig.buttons)) !==
            -1
          ) {
            this.redactorConfig.buttons.splice(index, 1, 'format');
          }

          // buttons.unorderedlist/orderedlist/undent/indent => buttons.lists
          var oldListButtons = [
              'unorderedlist',
              'orderedlist',
              'undent',
              'indent',
            ],
            lowestListButtonIndex;

          for (var i = 0; i < oldListButtons.length; i++) {
            if (
              (index = $.inArray(
                oldListButtons[i],
                this.redactorConfig.buttons
              )) !== -1
            ) {
              this.redactorConfig.buttons.splice(index, 1);

              if (
                typeof lowestListButtonIndex === 'undefined' ||
                index < lowestListButtonIndex
              ) {
                lowestListButtonIndex = index;
              }
            }
          }

          if (typeof lowestListButtonIndex !== 'undefined') {
            this.redactorConfig.buttons.splice(
              lowestListButtonIndex,
              0,
              'lists'
            );
          }
        } else {
          this.redactorConfig.buttons = [
            'html',
            'format',
            'bold',
            'italic',
            'deleted',
            'lists',
            'image',
            'file',
            'link',
          ];
        }

        // Now mix in the buttons provided by other options, before we start our own shenanigans
        // `buttonsAddFirst`
        if (this.redactorConfig.buttonsAddFirst) {
          this.redactorConfig.buttons =
            this.redactorConfig.buttonsAddFirst.buttons.concat(
              this.redactorConfig.buttons
            );
        }

        // `buttonsAdd`
        if (this.redactorConfig.buttonsAdd) {
          this.redactorConfig.buttons = this.redactorConfig.buttons.concat(
            this.redactorConfig.buttonsAdd.buttons
          );
        }

        // `buttonsAddBefore`
        if (this.redactorConfig.buttonsAddBefore) {
          var index;
          for (i = 0; i < this.redactorConfig.buttons.length; i++) {
            if (
              this.redactorConfig.buttons[i] ==
              this.redactorConfig.buttonsAddBefore.before
            ) {
              this.redactorConfig.buttons.splice(
                i,
                0,
                ...this.redactorConfig.buttonsAddBefore.buttons
              );
              break;
            }
          }
        }

        // `buttonsAddAfter`
        if (this.redactorConfig.buttonsAddAfter) {
          var index;
          for (i = 0; i < this.redactorConfig.buttons.length; i++) {
            if (
              this.redactorConfig.buttons[i] ==
              this.redactorConfig.buttonsAddAfter.after
            ) {
              this.redactorConfig.buttons.splice(
                i + 1,
                0,
                ...this.redactorConfig.buttonsAddAfter.buttons
              );
              break;
            }
          }
        }

        delete this.redactorConfig.buttonsAddFirst;
        delete this.redactorConfig.buttonsAddBefore;
        delete this.redactorConfig.buttonsAddAfter;
        delete this.redactorConfig.buttonsAdd;

        // Define our callbacks
        this.redactorConfig.callbacks = {
          started: Craft.RedactorInput.handleRedactorInit,
          focus: this.onEditorFocus.bind(this),
          blur: this.onEditorBlur.bind(this),
          contextbar: this.showContextBar.bind(this),
        };

        if (this.redactorConfig.buttons.length === 0) {
          delete this.redactorConfig.buttons;
        }

        // Initialize Redactor
        this.initRedactor();

        if (typeof Craft.Slideout !== 'undefined') {
          Garnish.on(Craft.Slideout, 'open', () =>
            $('body').addClass('redactor-element-editor-open')
          );
          Garnish.on(Craft.Slideout, 'close', () =>
            $('body').removeClass('redactor-element-editor-open')
          );
        }
      },

      initRedactor: function () {
        var selector = '#' + this.id;
        this.$textarea = $(selector);
        if (
          typeof this.redactorConfig.toolbarFixed === 'undefined' ||
          this.redactorConfig.toolbarFixed
        ) {
          // Set the toolbarFixedTarget depending on the context
          var target = this.$textarea.closest('#content');
          if (target.length) {
            this.redactorConfig.toolbarFixedTarget = target;
          }
        }

        Craft.RedactorInput.currentInstance = this;
        this.$textarea.redactor(this.redactorConfig);

        this.redactor = $R(selector);

        if (typeof this.redactorConfig.buttons === 'undefined') {
          this.redactorConfig.buttons = [];
        }

        var toolbarButtons = this.redactor.toolbar.getButtonsKeys();

        if (this.redactorConfig.buttons.indexOf('image') !== -1) {
          if (toolbarButtons.indexOf('image') !== -1) {
            this.redactor.plugin.craftAssetImages.overrideButton('image');
          } else {
            this.redactor.plugin.craftAssetImages.addButton(
              'image',
              this.redactorConfig.buttons.indexOf('image')
            );
          }

          this.redactor.plugin.craftAssetImages.setTransforms(this.transforms);
          this.redactor.plugin.craftAssetImages.setDefaultTransform(
            this.defaultTransform
          );
          this.redactor.plugin.craftAssetImages.setVolumes(this.volumes);
          this.redactor.plugin.craftAssetImages.setElementSiteId(
            this.elementSiteId
          );
          this.redactor.plugin.craftAssetImages.allowAllUploaders =
            this.showAllUploaders;
        }

        if (this.redactorConfig.buttons.indexOf('file') !== -1) {
          if (toolbarButtons.indexOf('file') !== -1) {
            this.redactor.plugin.craftAssetFiles.overrideButton('file');
          } else {
            this.redactor.plugin.craftAssetFiles.addButton(
              'file',
              this.redactorConfig.buttons.indexOf('file')
            );
          }
          this.redactor.plugin.craftAssetFiles.setVolumes(this.volumes);
          this.redactor.plugin.craftAssetFiles.setElementSiteId(
            this.elementSiteId
          );
        }

        if (toolbarButtons.indexOf('link') !== -1) {
          this.redactor.plugin.craftElementLinks.setElementSiteId(
            this.elementSiteId
          );
          this.redactor.plugin.craftElementLinks.setAllSites(this.allSites);
          if (this.linkOptions.length) {
            this.redactor.plugin.craftElementLinks.setLinkOptions(
              this.linkOptions
            );
          }
        }

        if (
          this.redactorConfig.plugins.indexOf('fullscreen') !== -1 &&
          typeof Craft.livePreview != 'undefined' &&
          window.livePreviewHideFullscreen === false
        ) {
          window.livePreviewHideFullscreen = true;
          Craft.livePreview.on('beforeEnter', function (ev) {
            $('a.re-button.re-fullscreen').addClass('hidden');
          });
          Craft.livePreview.on('beforeExit', function (ev) {
            $('a.re-button.re-fullscreen').removeClass('hidden');
          });
        }

        this.trigger('afterInitializeRedactor', {
          inputField: this,
        });

        if (this.enforceButtonOrder) {
          const desiredOrder = this.enforceButtonOrder;

          let $toolbar = $(this.redactor.toolbar.getElement().nodes);
          if (desiredOrder.length > 0) {
            let index = 0;

            // Reverse the desired order, so we can prepend them.
            // The other option was to leave the order and append them, but this better addresses an edge case
            // Where not all buttons and plugin buttons are defined in the enforced button order.
            for (let buttonName of desiredOrder.reverse()) {
              let $existing = $toolbar.find(`[data-re-name=${buttonName}]`);
              if ($existing.length > 0) {
                $toolbar.prepend($existing);
              }
            }
          }
        }

        delete Craft.RedactorInput.currentInstance;
      },

      onInitRedactor: function (redactor) {
        this.redactor = redactor;

        // Add the .focusable-input class for Craft.CP
        this.redactor.container.getElement().addClass('focusable-input');

        this.leaveFullscreenOnSaveShortcut();

        if (
          this.redactor.opts.toolbarFixed &&
          !Craft.RedactorInput.scrollPageOnReady
        ) {
          Garnish.$doc.ready(function () {
            Garnish.$doc.trigger('scroll');
          });

          Craft.RedactorInput.scrollPageOnReady = true;
        }
      },

      onEditorFocus: function () {
        this.redactor.container.getElement().trigger('focus');
      },

      onEditorBlur: function () {
        this.redactor.container.getElement().trigger('blur');
      },

      leaveFullscreenOnSaveShortcut: function () {
        if (
          typeof this.redactor.plugin.fullscreen !== 'undefined' &&
          typeof this.redactor.plugin.fullscreen.close === 'function'
        ) {
          Craft.cp.on(
            'beforeSaveShortcut',
            $.proxy(function () {
              if (this.redactor.plugin.fullscreen.isOpen) {
                this.redactor.plugin.fullscreen.close();
              }
            }, this)
          );
        }
      },

      replaceRedactorButton: function (key, title) {
        var previousButton = this.redactor.toolbar.getButton(key);

        // Ignore if the button isn't in use
        if (!previousButton) {
          return;
        }

        var icon = previousButton.$icon.get(0);

        var placeholderKey = key + '_placeholder';
        var placeholder = this.redactor.toolbar.addButtonAfter(
          key,
          placeholderKey,
          {title: title}
        );
        previousButton.remove();

        // Create the new button
        var button = this.redactor.toolbar.addButtonAfter(placeholderKey, key, {
          title: title,
        });
        placeholder.remove();

        button.setIcon(icon);

        return button;
      },

      showContextBar: function (e, contextbar) {
        if (this.justResized) {
          this.justResized = false;
          return;
        }

        var current = this.redactor.selection.getCurrent();
        var data = this.redactor.inspector.parse(current);

        var repositionContextBar = function (e, contextbar) {
          var parent = contextbar.$contextbar.parent();

          var top =
            e.clientY +
            contextbar.$contextbar.height() -
            10 -
            parent.offset().top +
            (contextbar.livePreview
              ? parent.scrollTop()
              : contextbar.$win.scrollTop());
          var left =
            e.clientX -
            contextbar.$contextbar.width() / 2 -
            parent.offset().left;

          var position = {
            left: left + 'px',
            top: top + 'px',
          };

          contextbar.$contextbar.css(position);
        };

        if (!data.isFigcaption() && data.isComponentType('image')) {
          var node = data.getComponent();
          var $img = $(node).find('img');
          if ($img.length === 1) {
            var matches = (matches = $img.attr('src').match(/#asset:(\d+)/i));
            if (matches) {
              var assetId = matches[1];
              Craft.sendActionRequest('POST', 'redactor', {data: {assetId}})
                .then((response) => {
                  var buttons = {
                    'image-editor': {
                      title: this.redactor.lang.get('image-editor'),
                      api: 'plugin.craftAssetImageEditor.open',
                      args: assetId,
                    },
                    edit: {
                      title: this.redactor.lang.get('edit'),
                      api: 'module.image.open',
                    },
                    remove: {
                      title: this.redactor.lang.get('delete'),
                      api: 'module.image.remove',
                      args: node,
                    },
                  };

                  contextbar.set(e, node, buttons);
                })
                .finally(() => {
                  repositionContextBar(e, contextbar);
                });
            }
          }
        }

        repositionContextBar(e, contextbar);
      },
    },
    {
      handleRedactorInit: function () {
        // `this` is the current Redactor instance.
        // `Craft.RedactorInput.currentInstance` is the current RedactorInput instance
        Craft.RedactorInput.currentInstance.onInitRedactor(this);
      },
    }
  );
})(jQuery);
