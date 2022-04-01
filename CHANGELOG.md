# Release Notes for Redactor for Craft CMS

## Unreleased

### Fixed
- Fix an error where it was impossible to select any Assets with Redactor field. ([#381](https://github.com/craftcms/redactor/issues/381))

## 3.0.0-beta.1 - 2022-03-04

### Added
- Added Craft 4 compatibility.

## 2.10.5 - 2022-02-25

### Fixed
- Fix a bug where sometimes Redactor field would auto-select the wrong site when showing the entry selection modal for links. ([#372](https://github.com/craftcms/redactor/issues/372))

## 2.10.4 - 2022-02-23

### Fixed
- Fix a bug where sometimes Redactor field would display the wrong orientation. ([#356](https://github.com/craftcms/redactor/issues/356), [#370](https://github.com/craftcms/redactor/issues/370))

## 2.10.3 - 2022-02-18

### Fixed
- Fixed a bug where linking to a Craft element inside a table would always change the original link text.

## 2.10.2 - 2022-02-17

### Fixed
- Fixed a bug introduced when fixing #364. ([#368](https://github.com/craftcms/redactor/issues/368))

## 2.10.1 - 2022-02-16

### Changed
- Improved HTML sanitizing on input.

### Fixed
- Fixed a but where Redactor fields would not initialize properly when they were the first field in a new Matrix block. ([#364](https://github.com/craftcms/redactor/issues/364))

### Security
- Fixed an XSS vulnerability

## 2.10.0 - 2022-02-11

### Changed
- Redactor now requires Craft 3.6 or later.
- The site selector dropdown now appears only for eligible links. ([#360](https://github.com/craftcms/redactor/issues/360))
- Static element URLs that contain query string parameters are no longer converted to reference tags.

### Deprecated
- Deprecated `craft\redactor\events\ModifyPurifierConfigEvent`. `craft\htmlfield\events\ModifyPurifierConfigEvent` should be used instead.

### Fixed
- Fixed a bug where Live Preview wouldn't work on older Craft versions. ([#359](https://github.com/craftcms/redactor/issues/359))

## 2.9.1 - 2022-02-07

### Fixed
- Fixed a bug where Redactor field would crash if attempting to save content that had empty links. ([#355](https://github.com/craftcms/redactor/issues/355))

## 2.9.0 - 2022-01-31

### Added
- Redactor fields now convert static element URLs to reference tags on save. ([#249](https://github.com/craftcms/redactor/issues/249))
- Entry selection modals now include a site selector. ([#242](https://github.com/craftcms/redactor/issues/242))
- Image modals now support a <kbd>Command</kbd>/<kbd>Ctrl</kbd> + <kbd>S</kbd> keyboard shortcut. ([#290](https://github.com/craftcms/redactor/issues/290))

### Fixed
- Fixed a bug where the field value wasn’t updated after content was removed via a context bar. ([#348](https://github.com/craftcms/redactor/issues/348))
- Fixed a bug where context bars weren’t visible within editor slideouts. ([#239](https://github.com/craftcms/redactor/issues/239))
- Fixed a bug where empty Redactor fields could be seen as not empty during validation. ([#260](https://github.com/craftcms/redactor/issues/260))
- Fixed a bug where some inline styles could be removed even if they were allowed by field plugins. ([#315](https://github.com/craftcms/redactor/issues/315))
- Fixed a bug where volume and transform names were getting double-encoded. ([#297](https://github.com/craftcms/redactor/issues/297))
- Fixed a bug where inserting a link into a large Redactor field would cause the browser to jump to the top of the field. ([#344](https://github.com/craftcms/redactor/issues/344))
- Fixed a bug where inline styles within tables weren’t getting removed. ([#350](https://github.com/craftcms/redactor/issues/350))
- Fixed a bug where translation messages weren’t getting registered for JavaScript properly.

### Changed
- Updated Redactor.js to 3.5.2.

## 2.8.8 - 2021-08-02

### Fixed
- Fixed a bug where a Javascript error was thrown when closing live preview pane, causing Redactor to break. ([#299](https://github.com/craftcms/redactor/issues/299), [#282](https://github.com/craftcms/redactor/issues/282))

## 2.8.7 - 2021-05-01

### Changed
- The list of Redactor config files is now sorted alphabetically. ([#308](https://github.com/craftcms/redactor/pull/308))

### Fixed
- Fixed a bug where privacy-enhanced YouTube video embeds were getting stripped out by HTML Purifier. ([#312](https://github.com/craftcms/redactor/issues/312)) 

## 2.8.6 - 2021-04-13

### Changed
- Improved the field’s focus styles.

## 2.8.5 - 2020-12-08

### Added
- Added the `enforceButtonOrder` Redactor config option, that allows setting an arbitrary button order. ([#218](https://github.com/craftcms/redactor/issues/218))

### Fixed
- Fixed a bug where Redactor would sometimes have trouble adding buttons to the toolbar. ([#293](https://github.com/craftcms/redactor/issues/293))

### Changed
- Updated Redactor.js to 3.4.7.
- Updated German and French translations.

## 2.8.4 - 2020-11-30

### Changed
- Updated Redactor.js to 3.4.6. ([#281](https://github.com/craftcms/redactor/issues/281))

## 2.8.3 - 2020-10-19

### Fixed
- Fixed a bug where protocol-relative YouTube and Vimeo video URLs were getting stripped by HTML Purifier. ([#278](https://github.com/craftcms/redactor/issues/278))

## 2.8.2 - 2020-10-14

### Added
- Added an `afterInitializeRedactor` event which allows further customization after Craft has initialized its plugins. ([#275](https://github.com/craftcms/redactor/issues/275))

### Fixed
- Fixed a bug where the Custom Redactor Config setting wasn’t validating as JSON if it contained any leading/trailing whitespace. ([#279](https://github.com/craftcms/redactor/issues/279))

## 2.8.1 - 2020-09-30

### Changed
- Updated Redactor.js to 3.4.3. ([#272](https://github.com/craftcms/redactor/issues/272))

## 2.8.0 - 2020-09-30

### Added
- It’s now possible to create a `Default.json` HTML Purifier config, which will be used by default, or if the specified config file is missing.
- The default HTML Purifier config now allows video embeds from YouTube and Vimeo.

## 2.7.5 - 2020-09-22

### Fixed
- Fixed a bug where “air” toolbar buttons had very low contrast. ([#271](https://github.com/craftcms/redactor/issues/271))

## 2.7.4 - 2020-09-02

### Fixed
- Fixed content styling issues. ([#266](https://github.com/craftcms/redactor/issues/266))

## 2.7.3 - 2020-08-28

### Fixed
- Fixed the Redactor status bar styling. ([#256](https://github.com/craftcms/redactor/issues/256))
- Fixed various content styling issues when the UI Mode was set to “Normal”. ([#262](https://github.com/craftcms/redactor/issues/262))

## 2.7.2 - 2020-08-25

### Changed
- The `showHtmlButtonForNonAdmins` setting now defaults to `true` for existing fields. ([#257](https://github.com/craftcms/redactor/issues/257))

### Fixed
- Fixed a bug where Redactor was removing empty `alt` attributes on images when saving. ([#259](https://github.com/craftcms/redactor/issues/259))

## 2.7.1 - 2020-08-14

### Changed
- Improved the styling of fixed toolbars.

### Fixed
- Restored the Asset Sources setting. ([#254](https://github.com/craftcms/redactor/issues/254))
- Fixed a bug where images with query strings in their URLs could be missing from the input. ([#255](https://github.com/craftcms/redactor/issues/255))

## 2.7.0 - 2020-08-09

### Added
- Added the “UI Mode” field setting.
- It’s now possible to change the transforms of selected assets. ([#134](https://github.com/craftcms/redactor/issues/134))
- Added the “Default transform” setting, which can be used to set a default transform that should be applied to images. ([#223](https://github.com/craftcms/redactor/issues/223))
- Added a field setting that determines whether non-admin users should be allowed to edit the field HTML. ([#129](https://github.com/craftcms/redactor/issues/129))
- It’s now possible to define the Redactor config on a per-field basis. ([#144](https://github.com/craftcms/redactor/issues/144))
- It’s now possible to create a `Default.json` Redactor config, which will be used by default, or if the specified config file is missing. ([#247](https://github.com/craftcms/redactor/issues/247))
- Added support for the `linkNewTab` Redactor config setting. ([#93](https://github.com/craftcms/redactor/issues/93))
- Added the “All entries” source to entry selection modals. ([#228](https://github.com/craftcms/redactor/issues/228))
- Added support for including query strings in linked element URLs. ([#235](https://github.com/craftcms/redactor/issues/235))
- Added `craft\redactor\Field::EVENT_DEFINE_REDACTOR_CONFIG`, which makes it possible to modify the Redactor config at runtime. ([#226](https://github.com/craftcms/redactor/issues/226))

### Changed
- Redactor fields now store fallback URLs on reference tag values, to be used if the linked element is no longer available. ([#168](https://github.com/craftcms/redactor/issues/168))
- Redactor now automatically opens the “Edit image” modal after inserting a single image.
- Redactor now only displays elements that have URIs when linking to an element.
- It’s now possible to include SVG images within field values, without them being removed by HTML Purifier. They will be sanitized with SVG Sanitizer instead.
- Redactor now requires Craft 3.5 or later.
- Updated Redactor.js to 3.4.2.

### Fixed
- Fixed a bug where the default Redactor config would not include image and link buttons. ([#224](https://github.com/craftcms/redactor/issues/224))
- Fixed a bug where Redactor would sometimes re-focus the editor, causing the page to jump. ([#222](https://github.com/craftcms/redactor/issues/222))

## 2.6.1 - 2020-03-18

### Changed
- Updated Redactor.js to 3.3.4.

### Fixed
- Fixed a bug where toolbar menus were getting a lower z-index than element editor HUDs. ([#215](https://github.com/craftcms/redactor/issues/215))
- Fixed a bug where the source view would get excess top padding when the `minHeight` setting was set. ([#211](https://github.com/craftcms/redactor/issues/211))

## 2.6.0.1 - 2020-02-14

### Fixed
- Fixed a bug where the editor would not show any buttons when the default Redactor config was used. ([#208](https://github.com/craftcms/redactor/issues/208))

## 2.6.0 - 2020-02-13

### Added
- Added support for Redactor’s `buttonsAddFirst`, `buttonsAddBefore`, `buttonsAddAfter`, and `buttonsAdd` config settings. ([#158](https://github.com/craftcms/redactor/issues/158))
- Added the “Show unpermitted volumes” setting, which determines whether the field should show volumes that the user doesn’t have permission to view (disabled by default for new fields; enabled by default for existing fields). ([#203](https://github.com/craftcms/redactor/issues/203))
- Added the “Show unpermitted files” setting, which determines whether the field should show files that the user doesn’t have permission to view per the “View files uploaded by other users” permission.
- Added `craft\redactor\events\ModifyPurifierConfigEvent`.
- Added `craft\redactor\Field::EVENT_MODIFY_PURIFIER_CONFIG`, which makes it possible to modify the HTML Purifier config at runtime. ([#147](https://github.com/craftcms/redactor/issues/147))

### Changed
- The “Remove inline styles” setting now also applies to `<img>` tags.
- Redactor fields no longer remove `style` attributes from `<img>` tags on load. ([#192](https://github.com/craftcms/redactor/issues/192))
- Updated Redactor.js to 3.3.2.

### Fixed
- Fixed a bug where it could be impossible to scroll within a Redactor field after pasting in HTML. ([#117](https://github.com/craftcms/redactor/issues/117))
- Fixed a bug where Redactor was aggressively removing newlines. ([#171](https://github.com/craftcms/redactor/issues/171))
- Fixed a bug where it wasn’t possible to link to cross-site elements. ([#188](https://github.com/craftcms/redactor/issues/188))
- Fixed a bug where the toolbar wasn’t sticking to the top of the window on scroll. ([#202](https://github.com/craftcms/redactor/issues/202), [#157](https://github.com/craftcms/redactor/issues/157))
- Fixed the position of the context bar that appears when clicking on links or images. ([#201](https://github.com/craftcms/redactor/issues/201))
- Fixed the position of the resize handle that appears when clicking on images with `imageResizable` enabled. ([#205](https://github.com/craftcms/redactor/issues/205), [#183](https://github.com/craftcms/redactor/issues/183))
- Fixed a bug where it wasn’t possible to add multiple images at once. ([#200](https://github.com/craftcms/redactor/issues/200))

## 2.5.0 - 2020-01-17

### Added
- Added the ability to create cross-site entry links. ([#187](https://github.com/craftcms/redactor/pull/187))

### Changed
- Updated the field styles for Craft 3.4.

## 2.4.0 - 2019-09-13

### Added
- Redactor is now translated into German. ([#131](https://github.com/craftcms/redactor/pull/131))
- Redactor is now translated into French. ([#145](https://github.com/craftcms/redactor/pull/145))

### Changed
- Redactor now requires Craft 3.2 or later.
- Entry and category links within Redactor field values now point to the same site that the field’s element was loaded in. ([#163](https://github.com/craftcms/redactor/issues/163))
- Updated Redactor.js to 3.3.0.

### Fixed
- Fixed a style inconsistency between `<h6>` tags in the Format menu and how they actually look in the editor. ([#142](https://github.com/craftcms/redactor/pull/142))
- Fixed a bug where Redactor were causing page unload warnings. ([#161](https://github.com/craftcms/redactor/issues/161))

## 2.3.3.2 - 2019-04-29

### Fixed
- Fixed an error that could occur after updating to Redactor 2.3.3. ([#140](https://github.com/craftcms/redactor/issues/140))

## 2.3.3.1 - 2019-04-26

### Fixed
- Fixed an error that occurred when updating to Redactor 2.3.3 if any Redactor fields didn’t have a `cleanupHtml` setting saved.

## 2.3.3 - 2019-04-26

### Changed
- Split the `cleanupHtml` setting into three separate settings: `removeInlineStyles`, `removeEmptyTags`, and `removeNbsp`. ([#125](https://github.com/craftcms/redactor/pull/125))
- Updated Redactor.js to 3.1.8.

### Fixed
- Fixed a bug where linking files or assets would not work as expected. ([#136](https://github.com/craftcms/redactor/issues/136))

### Deprecated
- Deprecated `craft\redactor\Field::cleanupHtml`.

## 2.3.2 - 2019-02-21

### Changed
- Updated Redactor.js to 3.1.7.

### Fixed
- Fixed a bug where full-screen editor would be obscured by the sidebar if the `toolbarFixed` config setting was set to `false.` ([#120](https://github.com/craftcms/redactor/issues/120))
- Fixed a bug where adding a second link in a list would not work as expected. ([#104](https://github.com/craftcms/redactor/issues/104))

## 2.3.1 - 2019-01-30

### Fixed
- Fixed a bug where the “Image editor” button wasn’t showing up when selecting assets for non-admin users.

## 2.3.0 - 2019-01-22

### Changed
- Updated Redactor.js to 3.1.6.

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
- Updated Redactor.js to 3.1.4
- Fullscreen plugin is now not available for use during Live Preview. ([#94](https://github.com/craftcms/redactor/issues/94))
- Redactor fields’ default HTML Purifier config now allows `id` attributes. ([#82](https://github.com/craftcms/redactor/issues/82))

### Fixed
- Fixed a bug where image editor would be unavailable for inserted assets. ([#95](https://github.com/craftcms/redactor/issues/95))
- Fixed a bug where Redactor was not getting translated properly for Norwegian languages. ([#99](https://github.com/craftcms/redactor/issues/99))

## 2.1.6 - 2018-08-21

### Changed
- Updated Redactor.js to 3.1.1

### Fixed
- Updating Redactor fixed a bug where inserting links to entries would not work in Firefox. ([#61](https://github.com/craftcms/redactor/issues/61))
- Updating Redactor fixed a bug where using the `inlinestyle` plugin would overwrite tags. ([#58](https://github.com/craftcms/redactor/issues/58))

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
- Updated Redactor.js to 3.0.11.
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
- Updated Redactor.js to 3.0.9.
- Improved Redactor field styles. ([#49](https://github.com/craftcms/redactor/pull/49))

## 2.0.1 - 2018-05-07

### Changed
- The plugin now attempts to remove `codemirror` and `source` values from Redactor configs on install.
- Redactor fields with the “Clean up HTML?” setting enabled now convert non-breaking spaces to normal spaces. ([#24](https://github.com/craftcms/redactor/issues/24))
- Updated Redactor.js to 3.0.8.

### Fixed
- Fixed a bug where inline styles created by the Alignment, Fontcolor, Fontfamily, and Fontsize plugins weren’t getting saved if the “Clean up HTML?” setting was enabled. ([#41](https://github.com/craftcms/redactor/issues/41))
- Fixed a bug where widgets embedded by the Widget plugin could steal focus from the fixed toolbar. ([#37](https://github.com/craftcms/redactor/issues/37))
- Fixed a bug where image resize handles would not be displayed correctly or at all when the `imageResizable` Redactor config setting was enabled. ([#39](https://github.com/craftcms/redactor/issues/39))

## 2.0.0.1 - 2018-05-01

### Fixed
- Fixed a case-sensitivity issue. ([#31](https://github.com/craftcms/redactor/issues/31))

## 2.0.0 - 2018-05-01

### Added
- Updated Redactor.js to 3.0.6.
- Added an Image Editor shortcut for asset-based images.
- Bundled the [BeyondGrammar](https://imperavi.com/redactor/plugins/beyondgrammar/), [Handle](https://imperavi.com/redactor/plugins/handle/), [Specialchars](https://imperavi.com/redactor/plugins/specialchars/), [Variable](https://imperavi.com/redactor/plugins/variable/), and [Widget](https://imperavi.com/redactor/plugins/widget/) Redactor plugins.

### Removed
- Removed the Codemirror and Source plugins (no longer needed in Redactor 3). Redactor configs that included these plugins will be automatically updated.

## 1.1.0 - 2018-04-03

### Changed
- Updated Redactor.js to 2.12.
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
