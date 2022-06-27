const {getConfig} = require('@craftcms/webpack');

module.exports = getConfig({
  context: __dirname,
  config: {
    entry: {
      redactor: './index.js',
    },
    module: {
      rules: [
        {
          test: require.resolve('./src/index.js'),
          loader: 'expose-loader',
          options: {
            exposes: [
              {
                globalName: 'Redactor',
                moduleLocalName: 'default',
              },
            ],
          },
        },
      ],
    },
  },
});
