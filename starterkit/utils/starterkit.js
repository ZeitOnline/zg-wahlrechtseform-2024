import {join} from 'path';
import {existsSync, readdirSync, readFileSync} from 'fs';

import {src, appTemplates as appTemplatesDir} from '../paths.js';

/**
 * Gets the names of the apps given using the env variable.
 * If no env variable was given it returns the names of all apps.
 */
export function getAppNames({all = false} = {all: false}) {
  let apps = null;
  if (
    !all &&
    process.env.APPS &&
    process.env.APPS.length &&
    process.env.APPS !== '*'
  ) {
    apps = process.env.APPS.split(',').map((d) => d.trim());
  } else {
    // get all apps
    apps = readdirSync(join(src, 'apps'), {withFileTypes: true})
      .filter((d) => d.isDirectory())
      .filter((d) => {
        return existsSync(join(src, 'apps', d.name, 'index.jsx'));
      })
      .map((d) => d.name);
  }
  return apps;
}

export function getAppTemplates() {
  const appTemplates = readdirSync(join(appTemplatesDir), {
    withFileTypes: true,
  })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const id = d.name;

      let config;
      try {
        config = readFileSync(
          join(appTemplatesDir, d.name, 'template-config.json'),
        );
        config = JSON.parse(config);
        config = {
          ...config,
          configFile: true,
        };
      } catch {
        config = {configFile: false};
      }

      return {id, label: config?.label || id, config};
    })
    .sort((a, b) => {
      if (a.id === 'default') {
        return -1;
      } else if (b.id === 'default') {
        return 1;
      }
      return 0;
    });

  return appTemplates;
}

export function getStarterkitConfig() {
  return JSON.parse(
    readFileSync(join(src, '__starterkit_config.json'), 'utf8'),
  );
}
