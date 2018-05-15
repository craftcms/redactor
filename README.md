# Redactor plugin for Craft

This plugin adds a “Redactor” field type to Craft CMS, which provides a rich text editor powered by [Redactor](https://imperavi.com/redactor/) by Imperavi.

## Requirements

This plugin requires Craft CMS 3.0.0-RC15 or later.

## Installation

To install the plugin, follow these instructions.

1.  Open your terminal and go to your Craft project:

    ```bash
    cd /path/to/project
    ```

2.  Then tell Composer to load the plugin:

    ```bash
    composer require craftcms/redactor
    ```

3.  In the Control Panel, go to Settings → Plugins and click the “Install” button for Redactor.

## Configuration

### Redactor Configs

You can create custom Redactor configs that will be available to your Redactor fields. They should be created as JSON files in your `config/redactor/` folder.

For example, if you created a `config/redactor/Standard.json` file with the following content:

```json
{
  "buttons": ["html", "format", "bold", "italic", "lists", "link", "file"],
  "plugins": ["fullscreen"]
}
```

…then a “Standard” option would become available within the “Redactor Config” setting on your Redactor field’s settings.

See the [Redactor documentation](https://imperavi.com/redactor/docs/settings/) for a list of available config options and buttons.

### HTML Purifier Configs

You can create custom HTML Purifier configs that will be available to your Redactor fields. They should be created as JSON files in your `config/htmlpurifier/` folder.

See the [HTML Purifier documentation](http://htmlpurifier.org/live/configdoc/plain.html) for a list of available config options.

### Redactor JS Plugins

All [1st party Redactor JS plugins](https://imperavi.com/redactor/plugins/) are bundled by default. To enable them, just add the plugin handle to the `plugin` array in your Redactor config.
