Changelog
=========

## Unreleased

### Changed
- Updated Redactor to 2.12.

### Fixed
- Fixed a bug where empty field values would still normalize to a `craft\redactor\FieldData` object, rather than `null`.
- Fixed a deprecation error when running Redactor on Craft 3.0.0-RC15 or later.
- Fixed support for Redactor’s `fixedToolbar` option. ([#9](https://github.com/craftcms/redactor/issues/9))
- Fixed a bug where Redactor fields weren’t getting translated into the user’s preferred language, when available. ([#12](https://github.com/craftcms/redactor/issues/12))

## 1.0.1 - 2018-01-15

### Changed
- Applied Craft’s “readable” text styles to Redactor inputs.

## 1.0.0.1 - 2017-12-10

### Fixed
- Fixed a bug where a `document.ready` event handler wasn’t getting registered correctly.

## 1.0.0 - 2017-12-04

Initial release.
