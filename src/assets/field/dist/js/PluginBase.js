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

    setElementSiteId: function (siteId) {
        this.elementSiteId = siteId;
    }
};
