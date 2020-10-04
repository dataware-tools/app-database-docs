module.exports = {
  stories: [
    '../src/**/*.stories.js',
    '../src/**/*.stories.jsx',
    '../src/**/*.stories.ts',
    '../src/**/*.stories.tsx'
  ],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
  webpackFinal: async (webpackConfig, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    const { loadCracoConfig } = require('@craco/craco/lib/config');
    const { getCraPaths } = require('@craco/craco/lib/cra');
    const context = {env: process.env.NODE_ENV};
    const cracoConfig = loadCracoConfig(context);
    context.paths = getCraPaths(cracoConfig);
    console.log(context);
    const {overrideWebpackConfig} = require('@semantic-ui-react/craco-less');
    overrideWebpackConfig({
      context,
      webpackConfig
    });

    // Return the altered config
    return webpackConfig;
  },
};
