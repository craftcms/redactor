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
        var allButtons = this.app.toolbar.getButtonsKeys();
        var targetButtonIndex = allButtons.indexOf(replaceButton);

        if (targetButtonIndex === -1) {
            return;
        }

        var previousButton = this.app.toolbar.getButtonByIndex(allButtons.indexOf(replaceButton));
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

    addButton: function (buttonName, position) {
        var allButtons = this.app.toolbar.getButtonsKeys();
        position = Math.min(allButtons.length, position);

        var buttonData = {
            title: this.title,
            api: this.apiTarget
        };

        var previous = this.app.toolbar.getButtonByIndex(position - 1);
        var button = this.app.toolbar.addButton(buttonName, buttonData);

        button.setIcon($('<i class="re-icon-'+buttonName+'"></i>').get(0));
    },

    setElementSiteId: function (siteId) {
        this.elementSiteId = siteId;
    }
};
