# Release Notes for Redactor for Craft CMS

## 2.3.1 - 2019-01-30

### Fixed
- Fixed a bug where the “Image editor” button wasn’t showing up when selecting assets for non-admin users.

## 2.3.0 - 2019-01-22

### Changed
- Updated Redactor to 3.1.6.

### Fixed
- Fixed a bug where adding links inside lists would not work as expected. ([#104](https://github.com/craftcms/redactor/issues/104))
- Fixed a bug where adding links inside tables would not work as expected. ([#98](https://github.com/craftcms/redactor/issues/98))
- Fixed a bug where Redactor would leave extra markup in the HTML. ([#106](https://github.com/craftcms/redactor/issues/106))

## 2.2.1 - 2019-01-17

### Fixed
- Fixed an error that occurred when updating to 2.2.0 if there were Redactor fields without the `availableTransforms` or `availableVolumes` set. ([#112](https://github.com/craftcms/redactor/issues/112))

## 2.2.0 - 2019-01-16

### Changed
- Redactor for Craft CMS now requires Craft 3.1.
- Improved Project Config compatibility.

## 2.1.7 - 2018-12-17

### Changed
- Updated Redactor to 3.1.4
- Fullscreen plugin is now not available for use during Live Preview. ([#94](https://github.com/craftcms/redactor/issues/94))
- Redactor fields’ default HTML Purifier config now allows `id` attributes. ([#82](https://github.com/craftcms/redactor/issues/82)) 

### Fixed
- Fixed a bug where image editor would be unavailable for inserted assets. ([#95](https://github.com/craftcms/redactor/issues/95))
- Fixed a bug where Redactor was not getting translated properly for Norwegian languages. ([#99](https://github.com/craftcms/redactor/issues/99))

## 2.1.6 - 2018-08-21

### Changed
- Updated Redactor to 3.1.1

### Fixed
- Updating Redactor fixed a bug where inserting links to entries would not work in Firefox. ([#61](https://github.com/craftcms/redactor/issues/61))
- Updating Redactor fixed a bug where using "inlinestyle" plugin would overwrite tags. ([#58](https://github.com/craftcms/redactor/issues/58))

## 2.1.5 - 2018-07-30

### Added
- The plugin is now translated into Hungarian. ([#73](https://github.com/craftcms/redactor/pull/73))

### Fixed
- Fixed a PHP error that could occur when editing elements with Redactor fields. ([#74](https://github.com/craftcms/redactor/issues/74))

## 2.1.4 - 2018-07-27

### Added
- The plugin is now translated into Dutch. ([#55](https://github.com/craftcms/redactor/pull/55))

### Fixed
- Fixed a bug where the fixed toolbar wan’t working. ([#9](https://github.com/craftcms/redactor/issues/9))

## 2.1.3 - 2018-07-25

- Fixed a bug where the fixed toolbar was not working. ([#9](https://github.com/craftcms/redactor/issues/9))
- Fixed a bug where it was impossible to define translation overrides. ([#63](https://github.com/craftcms/redactor/issues/63))

## 2.1.2 - 2018-07-14

### Fixed
- Fixed a Javascript error for Redactor fields with no buttons defined in the config. ([#68](https://github.com/craftcms/redactor/issues/68))

## 2.1.1 - 2018-07-13

### Changed
- Updated Redactor to 3.0.11.
- 6th level headings are no longer displayed in all-uppercase in the editor. ([craftcms/cms#2927](https://github.com/craftcms/cms/issues/2927))

### Fixed
- Fixed IE11 compatibility. ([#46](https://github.com/craftcms/redactor/issues/46))
- Fixed a bug where it wasn’t possible to edit links created using the File modal. ([#54](https://github.com/craftcms/redactor/issues/54))
- Fixed a bug where links created using the File modal would overwrite the selected text with the file title. ([#54](https://github.com/craftcms/redactor/issues/54))
- Fixed a bug where it was possible to initiate drag-and-drop uploading, which isn’t supported. ([craftcms/cms#2920](https://github.com/craftcms/cms/issues/2920))
- Fixed a bug where `File` and `Image` buttons were missing.
- Fixed a bug where File modal was generating incorrect links.

## 2.1.0 - 2018-05-15

### Changed
- Updated Redactor to 3.0.9.
- Improved Redactor field styles. ([#49](https://github.com/craftcms/redactor/pull/49))

## 2.0.1 - 2018-05-07

### Changed
- The plugin now attempts to remove `codemirror` and `source` values from Redactor configs on install.
- Redactor fields with the “Clean up HTML?” setting enabled now convert non-breaking spaces to normal spaces. ([#24](https://github.com/craftcms/redactor/issues/24))
- Updated Redactor to 3.0.8.

### Fixed
- Fixed a bug where inline styles created by the Alignment, Fontcolor, Fontfamily, and Fontsize plugins weren’t getting saved if the “Clean up HTML?” setting was enabled. ([#41](https://github.com/craftcms/redactor/issues/41))
- Fixed a bug where widgets embedded by the Widget plugin could steal focus from the fixed toolbar. ([#37](https://github.com/craftcms/redactor/issues/37))
- Fixed a bug where image resize handles would not be displayed correctly or at all when the `imageResizable` Redactor config setting was enabled. ([#39](https://github.com/craftcms/redactor/issues/39))

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
