const {getConfig} = require('@craftcms/webpack');

module.exports = getConfig({
  context: __dirname,
  config: {
    entry: {
      CraftAssetFiles: './js/CraftAssetFiles.js',
      CraftAssetImageEditor: './js/CraftAssetImageEditor.js',
      CraftAssetImages: './js/CraftAssetImages.js',
      CraftElementLinks: './js/CraftElementLinks.js',
      PluginBase: './js/PluginBase.js',
      RedactorInput: './js/RedactorInput.js',
      RedactorOverrides: './js/RedactorOverrides.js',
    },
    devServer: {
      hot: false,
    },
    module: {
      rules: [
        {
          test: require.resolve('./src/js/RedactorOverrides.js'),
          loader: 'expose-loader',
          options: {
            exposes: [
              {
                globalName: 'imageResizeClass',
                moduleLocalName: 'imageResizeClass',
              },
              {
                globalName: 'toolbarFixedClass',
                moduleLocalName: 'toolbarFixedClass',
              },
              {
                globalName: 'inputCleanerService',
                moduleLocalName: 'inputCleanerService',
              },
              {
                globalName: 'contextBarClass',
                moduleLocalName: 'contextBarClass',
              },
              {
                globalName: 'toolbarDropdownClass',
                moduleLocalName: 'toolbarDropdownClass',
              },
              {
                globalName: 'toolbarService',
                moduleLocalName: 'toolbarService',
              },
            ],
          },
        },
      ],
    },
  },
});
