/* jshint esversion: 6 */
/* globals module, require */
const {getConfig} = require('@craftcms/webpack');

module.exports = getConfig({
  context: __dirname,
  config: {
    entry: {
      CraftAssetFiles: './js/CraftAssetFiles.js',
      CraftAssetImageEditor: './js/CraftAssetImageEditor.js',
      CraftAssetImages: './js/CraftAssetImages.js',
      CraftElementLinks: './js/CraftElementLinks.js',
      PluginBase: './js/PluginBase',
      RedactorInput: './js/RedactorInput.js',
      RedactorOverrides: './js/RedactorOverrides.js',
    },
  },
});
