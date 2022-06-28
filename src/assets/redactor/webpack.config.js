const {getConfig} = require('@craftcms/webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const postcss  = require('postcss');

module.exports = getConfig({
  context: __dirname,
  config: {
    entry: {
      'redactor-styles': './redactor-styles.js',
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            context: path.resolve(__dirname, 'src', 'lib', 'redactor'),
            from: '**/*.js',
            to: '.',
          },
          {
            context: path.resolve(__dirname, 'src', 'lib'),
            from: 'redactor-plugins/**/*.js',
            to: '.',
          },
          {
            context: path.resolve(__dirname, 'src', 'lib'),
            from: 'redactor-plugins/**/*.css',
            to: '.',
            transform(content, absoluteFrom) {
              return postcss([require('autoprefixer')]).process(content).css;
            },
          },
        ],
      }),
    ]
  }
});
