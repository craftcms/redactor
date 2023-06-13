<p align="center"><img src="./src/icon.svg" width="100" height="100" alt="Redactor icon"></p>

<h1 align="center">Redactor</h1>

This plugin adds a “Redactor” field type to Craft CMS, which provides a rich text editor powered by [Redactor](https://imperavi.com/redactor/) by Imperavi.

## Requirements

This plugin requires Craft CMS 4.0 or later.

## Installation

You can install this plugin from the Plugin Store or with Composer.

#### From the Plugin Store

Go to the Plugin Store in your project’s Control Panel and search for “Redactor”. Then click on the “Install” button in its modal window.

#### With Composer

Open your terminal and run the following commands:

```bash
# go to the project directory
cd /path/to/my-project.test

# tell Composer to load the plugin
composer require craftcms/redactor

# tell Craft to install the plugin
./craft install/plugin redactor
```

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

### Craft Redactor config options

Craft addes the `enforceButtonOrder` config option that can be set to a list of button names in the expected order. This option should be used to address the uncontrollable button order set by Redactor when adding plugins to the configuration.

### HTML Purifier Configs

Redactor fields use [HTML Purifier](http://htmlpurifier.org) to ensure that no malicious code makes it into its field values, to prevent XSS attacks and other vulnerabilities.

You can create custom HTML Purifier configs that will be available to your Redactor fields. They should be created as JSON files in your `config/htmlpurifier/` folder.

Copy [Default.json](https://github.com/craftcms/craft/blob/main/config/htmlpurifier/Default.json) as a starting point, which is the default config that Redactor fields use if no custom HTML Purifier config is selected.

See the [HTML Purifier documentation](http://htmlpurifier.org/live/configdoc/plain.html) for a list of available config options.

### Redactor JS Plugins

All [first party Redactor JS plugins](https://imperavi.com/redactor/plugins/) are bundled by default. To enable them, just add the plugin handle to the `plugin` array in your Redactor config.

```json
{
  "plugins": ["alignment", "fullscreen"]
}
```

You can also supply your own Redactor plugins by saving them in your `config/redactor/` folder. You can either place the plugin directly in that folder, or within a subfolder that is named after the plugin:

```
config/
└── redactor/
    └── plugins/
        ├── foo.js
        └── bar/
            └── bar.js
```

Other Craft plugins can supply additional Redactor JS plugin locations using the `craft\redactor\Field::EVENT_REGISTER_PLUGIN_PATHS` event.
