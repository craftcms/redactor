const {getConfig} = require('@craftcms/webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const postcss = require('postcss');
const postcssConfig = require('@craftcms/webpack/postcss.config.js');

module.exports = getConfig({
  context: __dirname,
  config: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'redactor/**/*.js',
            to: '.',
          },
          {
            from: 'redactor-plugins/**/*.js',
            to: '.',
          },
          {
            from: '{redactor,redactor-plugins}/**/*.css',
            to: '.',
            transform(content, absoluteFrom) {
              return postcss(postcssConfig.plugins || []).process(content).css;
            },
          },
        ],
      }),
    ],
  },
});
