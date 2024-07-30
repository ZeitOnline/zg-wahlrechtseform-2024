import {join} from 'path';
import {src} from '../../paths.js';
import {getAppNames} from '../../utils/starterkit.js';

/**
 * export pages during ssr build
 */
function exportPages() {
  const appPaths = getAppNames().map((d) => join(src, 'apps', d, 'index.jsx'));
  return {
    name: 'export-pages',
    transform(src, id) {
      if (!appPaths.includes(id)) {
        return null;
      }

      return `export const pages = import.meta.glob('./pages/*.jsx', {eager: true});
        ${src}`;
    },
    apply(config, {command}) {
      // apply only on build and SSR
      return command === 'build' && config.build.ssr;
    },
  };
}

export default exportPages;
