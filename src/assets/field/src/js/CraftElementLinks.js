var plugin = $.extend({}, Craft.Redactor.PluginBase, {
  linkOptions: [],
  existingText: '',
  hack: null,
  allSites: {},
  modalState: {
    selectedLink: {
      text: null,
      url: null,
    },
  },

  // Do nothing on start.
  start: function () {},
  showModal: function (args, zIndex) {
    let refHandle = args.refHandle,
      callback = args.callback;

    this.saveSelection(this.app);

    // Create a new one each time because Redactor creates a new one and we can't reuse the references.
    const modal = Craft.createElementSelectorModal(args.elementType, {
      storageKey: 'RedactorInput.LinkTo.' + args.elementType,
      sources: args.sources,
      criteria: args.criteria,
      defaultSiteId: this.elementSiteId,
      autoFocusSearchBox: false,
      onSelect: $.proxy(function (elements) {
        if (elements.length) {
          this.restoreSelection(this.app);
          const element = elements[0];
          const selectedText = this.app.selection.getText();
          this.modalState.selectedLink = {
            url:
              element.url +
              '#' +
              refHandle +
              ':' +
              element.id +
              '@' +
              element.siteId,
            text: selectedText.length > 0 ? selectedText : element.label,
          };

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
      open: function (modal, form) {
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
          url: null,
        };

        let existingUrl = $form.find('input[name=url]').val();

        // Only add site selector if it looks like an element reference link
        const refHandlesRegex = Craft.Redactor.localizedRefHandles.join('|');
        const match = existingUrl.match(
          new RegExp(`(#(?:${refHandlesRegex}):\\d+)(?:@(\\d+))?`)
        );

        if (match) {
          let siteOptions = this.allSites;
          const existingSiteId = match[2] ? parseInt(match[2], 10) : null;

          const $select = $('<select id="modal-site-selector"></select>').on(
            'change',
            (ev) => {
              const selectedSiteId = parseInt($(ev.currentTarget).val(), 10);
              let ref = match[1];

              if (selectedSiteId) {
                ref += `@${selectedSiteId}`;
              }

              const newUrl = existingUrl.replace(match[0], ref);
              $form.find('input[name=url]').val(newUrl);
            }
          );

          let selected = !existingSiteId ? ' selected="selected"' : '';
          $select.append(
            `<option value="0"${selected}>${Craft.t(
              'app',
              'Link to the current site'
            )}</option>`
          );

          for ([siteId, siteName] of Object.entries(siteOptions)) {
            let selected =
              existingSiteId === parseInt(siteId, 10)
                ? ' selected="selected"'
                : '';
            $select.append(
              `<option value="${siteId}"${selected}>${siteName}</option>`
            );
          }

          const $formItem = $(
            '<div class="form-item form-item-site"><label for="modal-site-selector">Site</label></div>'
          ).append($select);

          $(form.nodes[0]).append($formItem);
        }
      },
      close: function (modal) {
        // Revert the functionality.
        modal.app.editor.focus = this.hack;
        this.hack = null;
      },
    },
  },

  setLinkOptions: function (linkOptions) {
    var button = this.app.toolbar.getButton('link'),
      dropdown = button.getDropdown(),
      items = dropdown.items,
      newList = {},
      counter = 0;

    for (var option in linkOptions) {
      option = linkOptions[option];
      newList['custom' + ++counter] = {
        title: option.optionTitle,
        api: 'plugin.craftElementLinks.showModal',
        args: {
          elementType: option.elementType,
          refHandle: option.refHandle,
          sources: option.sources,
          criteria: option.criteria,
        },
      };
    }

    button.setDropdown($.extend(newList, items));
  },

  setAllSites: function (allSites) {
    this.allSites = allSites;
  },
});

(function ($R) {
  $R.add('plugin', 'craftElementLinks', plugin);
})(Redactor);
