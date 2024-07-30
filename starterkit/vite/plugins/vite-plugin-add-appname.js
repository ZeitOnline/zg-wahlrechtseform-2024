import {join} from 'path';
import {src} from '../../paths.js';
import {getAppNames} from '../../utils/starterkit.js';
import chalk from 'chalk';

/**
 * add appName to exported App
 */
const appNameRegex = /src\/apps\/(.+)\/index\.jsx/gi;

function addAppname() {
  // break process, if "apps", "app" or "APP" is defined in env
  // only "APPS" is allowed
  if (process.env.APP || process.env.apps || process.env.app) {
    console.warn(
      chalk.red(
        "ERROR: If you want to build a single app, use 'APPS=appname'.",
      ),
    );
    process.exit(1);
  }
  const appPaths = getAppNames().map((d) => join(src, 'apps', d, 'index.jsx'));
  return {
    name: 'add-appname',
    transform(src, id) {
      if (!appPaths.includes(id)) {
        return null;
      }
      const appName = Array.from(id.matchAll(appNameRegex))[0][1];

      return src.replace(
        'zonReactApp({',
        `zonReactApp({appName: '${appName}',`,
      );
    },
    apply: 'build',
  };
}

export default addAppname;
