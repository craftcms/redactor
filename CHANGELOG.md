# Release Notes for Redactor

## 2.0.0.1 - 2018-05-01

### Fixed
- Fixed a case-sensitivity issue. ([#31](https://github.com/craftcms/redactor/issues/31))

## 2.0.0 - 2018-05-01

### Added
- Updated Redactor to 3.0.6.
- Added an Image Editor shortcut for asset-based images.
- Bundled the [BeyondGrammar](https://imperavi.com/redactor/plugins/beyondgrammar/), [Handle](https://imperavi.com/redactor/plugins/handle/), [Specialchars](https://imperavi.com/redactor/plugins/specialchars/), [Variable](https://imperavi.com/redactor/plugins/variable/), and [Widget](https://imperavi.com/redactor/plugins/widget/) Redactor plugins.

### Removed
- Removed the Codemirror and Source plugins (no longer needed in Redactor 3). Redactor configs that included these plugins will be automatically updated.

## 1.1.0 - 2018-04-03

### Changed
- Updated Redactor to 2.12.
- Redactor now comes bundled with all of Imperavi’s Redactor 2 plugins. ([#14](https://github.com/craftcms/redactor/issues/14))

### Fixed
- Fixed a bug where empty field values would still normalize to a `craft\redactor\FieldData` object, rather than `null`.
- Fixed a deprecation error when running Redactor on Craft 3.0.0-RC15 or later.
- Fixed support for Redactor’s `fixedToolbar` option. ([#9](https://github.com/craftcms/redactor/issues/9))
- Fixed a bug where Redactor fields weren’t getting translated into the user’s preferred language, when available. ([#12](https://github.com/craftcms/redactor/issues/12))
- Fixed a bug where H4s were larger than H3s. ([#15](https://github.com/craftcms/redactor/issues/15))
- Fixed a bug where Redactor fields would not honor the `imageTag` config setting when inserting an image. ([#10](https://github.com/craftcms/redactor/issues/10))

## 1.0.1 - 2018-01-15

### Changed
- Applied Craft’s “readable” text styles to Redactor inputs.

## 1.0.0.1 - 2017-12-10

### Fixed
- Fixed a bug where a `document.ready` event handler wasn’t getting registered correctly.

## 1.0.0 - 2017-12-04

Initial release.
