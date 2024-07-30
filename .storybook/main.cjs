module.exports = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../docs/**/*.mdx',
    '../docs/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../core/**/*.mdx',
    '../core/**/*.stories.@(js|jsx|ts|tsx)',
    '../starterkit/**/*.mdx',
    '../starterkit/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    // '@storybook/addon-mdx-gfm',
    '@storybook/addon-storysource',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  staticDirs: ['../src/static', '../src/public', '../docs'],

  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: 'starterkit/vite/config/vite.config.js',
      },
    },
  },

  async viteFinal(config, {configType}) {
    // Filter out the remove-css-var plugin by its name
    const filteredPlugins = config.plugins.filter((plugin) => {
      return plugin.name !== 'remove-css-var';
    });
    return {
      ...config,
      plugins: filteredPlugins,
    };
  },
};
