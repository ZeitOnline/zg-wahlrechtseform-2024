import {join} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import dsv from '@rollup/plugin-dsv';
import svgr from 'vite-plugin-svgr';
import {threeMinifier} from '@yushijinhun/three-minifier-rollup';
import {merge} from 'webpack-merge';
import checker from 'vite-plugin-checker';
import postcssPresetEnv from 'postcss-preset-env';
import postCssShortCssVars from '@zonx/postcss-short-css-vars';
import inspect from 'vite-plugin-inspect';
import {visualizer} from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';

import {starterkit, src, core, dist, wizard} from '../../paths.js';
import {build} from './build.js';
import {getPublicPath, isSSRBuild} from '../utils.js';
import {getStarterkitConfig} from '../../utils/starterkit.js';
import exportPages from '../plugins/vite-plugin-export-pages.js';
import addAppname from '../plugins/vite-plugin-add-appname.js';
import exportFakeViviProvider from '../plugins/vite-plugin-export-fake-vivi-provider.js';
import postCssTrackVar from '../plugins/postcss-plugin-track-var.js';
import removeCssVar from '../plugins/vite-plugin-remove-css-var.js';

const STARTERKIT_CONFIG = getStarterkitConfig();

export const PROJECT_PREFIX = (
  STARTERKIT_CONFIG.deploymentPath || 'blah'
).replace(/\//g, '-');

export default defineConfig(({command, mode, ssrBuild}) => {
  // in dev, we want the express server to serve from public dir,
  // so we set an empty fake one
  // for production, it should work as intended, so we use the real one
  const publicDir =
    mode === 'development'
      ? join(starterkit, 'vite', 'fake-public-dir')
      : join(src, 'public');

  const esbuild =
    ssrBuild || mode === 'production'
      ? {
          esbuild: {
            drop: ['console', 'debugger'],
          },
        }
      : {};

  let plugins = [];
  if (mode === 'production' && !isSSRBuild()) {
    plugins = [visualizer({filename: join(dist, 'stats.html')})];
  }
  if (!isSSRBuild()) {
    plugins.push(
      // for now, only optimise pngs which are not already compressed
      viteImagemin({
        filter: (file) => file.endsWith('.png') && !file.includes('compressed'),
        gifsicle: false,
        svgo: false,
        optipng: false,
        mozjpeg: false,
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
      }),
    );
  }

  const base = getPublicPath(STARTERKIT_CONFIG.deploymentPath);

  // we need this to track which css vars are used
  const cssVarRecords = new Map();

  const baseConfig = {
    root: join(src, '..'),
    resolve: {
      alias: {
        starterkit,
        src,
        core,
        wizard,
        icons: join(core, 'icons'),
      },
    },
    ...esbuild,
    plugins: [
      {...threeMinifier(), enforce: 'pre'},
      exportPages(),
      addAppname(),
      exportFakeViviProvider(),
      react({
        babel: {
          plugins: [
            [
              '@zonx/babel-plugin-short-css-vars',
              {
                formatter: (name) => {
                  const re = new RegExp(`${PROJECT_PREFIX}-`, ['g']);
                  const varName = `${PROJECT_PREFIX}-${name.replace(re, '')}`;

                  let record = cssVarRecords.get('--' + varName);
                  if (!record) {
                    cssVarRecords.set('--' + varName, {uses: 1});
                  }

                  return varName;
                },
              },
            ],
          ],
        },
      }),
      dsv(),
      checker({
        eslint: {
          lintCommand: `eslint --no-error-on-unmatched-pattern "${src}/**/*.{js,jsx}"`,
        },
        overlay: {
          initialIsOpen: false,
        },
        terminal: false,
        enableBuild: false,
      }),
      svgr({
        svgrOptions: {
          replaceAttrValues: {'#252525': '{props.color || "currentColor"}'},
          icon: false,
          title: false,
          svgoConfig: {
            plugins: ['preset-default', 'removeDimensions', 'removeTitle'],
          },
        },
        include: '**/*.svg?react',
      }),
      ...plugins,
      inspect(),
      removeCssVar({records: cssVarRecords}),
    ],
    base,
    define: {
      __PUBLIC_URL__: JSON.stringify(base),
      __PROJECT_PREFIX__: JSON.stringify(PROJECT_PREFIX),
    },
    envDir: join(starterkit, 'vite'),
    publicDir,
    css: {
      devSourcemap: true,
      modules: {
        scopeBehaviour: 'global',
      },
      postcss: {
        plugins: [
          postcssPresetEnv(),
          postCssShortCssVars({
            formatter: (name) => {
              if (name.startsWith('z-')) {
                return name;
              }
              return `${PROJECT_PREFIX}-${name}`;
            },
          }),
          postCssTrackVar({records: cssVarRecords}),
        ],
      },
    },
  };

  return merge(baseConfig, build());
});
