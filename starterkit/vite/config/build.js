import {join} from 'path';
import {merge} from 'webpack-merge';

import {src, dist} from '../../paths.js';
import {isStaging, isProduction, isSSRBuild} from '../utils.js';
import {getAppNames, getStarterkitConfig} from '../../utils/starterkit.js';
import {chalkGreen} from '../../utils/logging.js';

function getInput(prodClientBuild) {
  return getAppNames({all: prodClientBuild}).reduce(
    (input, d) => ({...input, [d]: join(src, 'apps', d, 'index.jsx')}),
    {},
  );
}

export function build() {
  // pre build check
  const deploymentPath = getStarterkitConfig().deploymentPath;
  if (isProduction() && deploymentPath === '2023/starterkit') {
    throw new Error(
      'Deployment path has the default value of 2023/starterkit.\nUpdate the deployment path using http://localhost:3000/wizard or using the src/__starterkit_config.json file to build or publish your application.\n',
    );
  }

  let build = {
    manifest: true,
    emptyOutDir: true,
    rollupOptions: {
      input: getInput(),
    },
  };

  console.log('\nDeployment path:'.padEnd(16), chalkGreen(deploymentPath));
  console.log('SSR build:'.padEnd(16), isSSRBuild());
  console.log('Staging:'.padEnd(16), isStaging());
  console.log('Production:'.padEnd(16), isProduction(), '\n');

  if (isSSRBuild()) {
    build = merge(build, {
      target: 'node18',
      ssr: true,
      minify: false,
      outDir: join(dist, 'node'),
      rollupOptions: {
        input: getInput(),
        output: {
          entryFileNames: '[name].mjs',
          // common chunks need to be hashed
          // because they changed based on which apps get build
          chunkFileNames: '[name].[hash].mjs',
        },
      },
    });
  } else {
    // client build
    // @TODO add more chunks for commonly used libs
    const threeChunk =
      /node_modules\/(@react-three|three|@react-spring\/three)/g;
    const reactChunk = /node_modules\/(react-dom|react\/)/g;
    build = merge(build, {
      rollupOptions: {
        // build all apps so code splitting works
        input: getInput(true),
        output: {
          entryFileNames: 'assets/[name].[hash].mjs',
          // assetFileNames: '[name].[hash].[extname]',
          chunkFileNames: 'assets/[name].[hash].mjs',
          manualChunks: (id) => {
            if (id.match(threeChunk)) {
              return 'three';
            }
            if (id.match(reactChunk)) {
              return 'react';
            }
          },
        },
      },
      outDir: join(dist, 'client'),
    });
  }

  return {build};
}
