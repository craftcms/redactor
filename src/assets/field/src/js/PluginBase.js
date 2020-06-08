Craft.Redactor = {};

Craft.Redactor.PluginBase = {
    app: null,
    title: null,
    apiTarget: null,
    icon: null,
    elementSiteId: null,

    init: function(app) {
        this.app = app;
    },

    start: function() {
        this.title = this.app.lang.get(this.title);
    },

    overrideButton: function (replaceButton) {
        var previousButton = this.app.toolbar.getButton(replaceButton);

        if (!previousButton) {
            this.addButton(replaceButton);
            return;
        }

        var icon = previousButton.$icon.get(0);

        var placeholderKey = replaceButton+'_placeholder';
        var placeholder = this.app.toolbar.addButtonAfter(replaceButton, placeholderKey, {title: this.title});
        previousButton.remove();

        var buttonData = {
            title: this.title,
            api: this.apiTarget
        };

        // Create the new button
        var button = this.app.toolbar.addButtonAfter(placeholderKey, replaceButton, buttonData);
        placeholder.remove();

        button.setIcon(icon);
    },

    addButton: function (buttonName, index) {
        var allButtons = this.app.toolbar.getButtonsKeys();

        var buttonData = {
            title: this.title,
            api: this.apiTarget
        };

        // Figure out where to put it
        var position, $el;

        if (typeof index !== 'undefined') {
            var allButtons = this.app.toolbar.getButtons();

            if (allButtons.length > index) {
                position = 'before';
                $el = allButtons[index];
            }
        }

        var button = this.app.toolbar.addButton(buttonName, buttonData, position, $el);
        button.setIcon($('<i class="re-icon-'+buttonName+'"></i>').get(0));
    },

    setElementSiteId: function (siteId) {
        this.elementSiteId = siteId;
    }
};
