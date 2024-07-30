import {join} from 'node:path';
import open, {apps} from 'open';
import chalk from 'chalk';
import express from 'express';
import {format as prettierFormat} from 'prettier';
import compression from 'compression';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer as createViteServer} from 'vite';
import {config} from 'dotenv';

import wizardRouter from './wizard.js';
import {DEFAULT_STATIC_ID} from '../constants.js';
import {
  getPageForUrl,
  getClientScriptTagForUrl,
  getParamsForUrl,
  getLocalIPs,
  getPathToEnvFile,
  envFileNotice,
} from './utils.js';
import {getAppNames} from '../utils/starterkit.js';
import render from '../render/index.js';
import viteConfigFunction from './config/vite.config.js';
import {src} from '../paths.js';

config({path: getPathToEnvFile()});
envFileNotice();

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort,
) {
  const localIPs = await getLocalIPs();
  const ssl = false;

  const app = express();
  app.use(compression());

  const viteConfig = await viteConfigFunction({mode: 'development'});
  const defineOverride = isProd
    ? {}
    : {
        __PUBLIC_URL__: JSON.stringify(`http://${localIPs[0]}:3000/`),
      };

  const url = `http://${localIPs?.[0] || 'localhost'}:3000`;

  /**
   * @type {import('vite').ViteDevServer}
   */
  const vite = await createViteServer({
    root,
    logLevel: 'info',
    server: {
      middlewareMode: true,
      hmr: {
        port: hmrPort,
      },
      https: ssl,
      host: true,
      watch: {ignored: ['dist/**']},
    },
    ...viteConfig,
    define: {
      ...viteConfig.define,
      ...defineOverride,
    },
    appType: 'custom',
  });
  // use vite's connect instance as middleware
  app.use(vite.middlewares);
  app.use(express.json());

  // serve public/maptiles dir from express to be able to set headers
  // do not serve maptiles from public dir to avoid copying maptiles during build
  app.use(
    '/maptiles',
    express.static(join(src, 'maptiles'), {
      setHeaders: function (res, path) {
        if (path.endsWith('.pbf')) {
          res.setHeader('Content-Type', 'application/x-protobuf');
          res.setHeader('Content-Encoding', 'gzip');
        }
      },
    }),
  );
  app.use(express.static(join(src, 'public')));

  app.use('/serviceworker.js', async (req, res) => {
    res.set('Origin', 'https://www.zeit.de');
    res.redirect('https://www.zeit.de/serviceworker.js');
  });
  app.use('/api/wizard', wizardRouter);
  // app.use('/wizard-api/:method', async (req, res) => {
  //   console.log(req);
  //   req.params;
  //   res.end(JSON.stringify({hello: true}));
  // });
  app.use('*', async (req, res) => {
    const url = req.baseUrl.replace('__inspect/', '');
    const appNames = getAppNames({all: true});
    if (
      !appNames.length &&
      !url.startsWith('/wizard') &&
      !url.startsWith('/app-templates')
    ) {
      return res.redirect('/wizard');
    }
    try {
      const scriptTag = getClientScriptTagForUrl(url);
      const page = getPageForUrl(url);
      let FullPage = null;
      let FakeViviProvider = null;
      try {
        const pageModule = await vite.ssrLoadModule(page);
        FullPage = pageModule.default;
        FakeViviProvider = pageModule.FakeViviProvider;
      } catch (e) {
        return res.redirect('/wizard');
      }
      let {appPath, id, hasEntry} = getParamsForUrl(url);

      let app = null;
      let viteHtml = '';
      let staticProps = {};

      if (hasEntry) {
        const appModule = await vite.ssrLoadModule(appPath);
        app = appModule.default;
        viteHtml = await vite.transformIndexHtml(url, scriptTag);

        if (app.staticIncludes) {
          let ids = [DEFAULT_STATIC_ID];
          if (app.getIdsForStaticIncludes) {
            ids = await app.getIdsForStaticIncludes();
          }
          if (ids !== undefined && !ids.includes(id)) {
            // fallback to first id if none or an invalid one was given
            id = ids[0];
          }
        }
        if (app.getPropsForStaticIncludes) {
          staticProps = await app.getPropsForStaticIncludes(id);
        }
      }

      let html = renderToStaticMarkup(
        createElement(
          FakeViviProvider,
          {...req.query, app},
          createElement(FullPage, {...staticProps, id}),
        ),
      ).replace('</body>', `${viteHtml}</body>`);

      html = `<!DOCTYPE html>${html}`;
      html = await prettierFormat(html, {
        parser: 'html',
      });

      if (app) {
        html = await render({
          App: app,
          html,
          id,
          addStaticPropsToWindow: true,
          isDocument: true,
          staticProps,
        });
      }

      res.status(200).set({'Content-Type': 'text/html'}).end(html);
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      const msg = 'SSR Error: ' + e.stack;
      console.log(chalk.red(msg));
      res.status(500).end(msg);
    }
  });

  return {app, vite, ssl, url};
}

async function go() {
  const {app} = await createServer();
  app.listen(3000, async () => {
    const url = 'http://localhost:3000/';
    console.log(chalk.green(`\nServer started on ${url}\n`));
    const openInBrowser = process.env?.STARTERKIT_OPEN_IN_BROWSER !== 'false';

    if (openInBrowser) {
      await open(url, {
        app: apps[process.env.STARTERKIT_BROWSER || 'browser'],
      });
    }
  });
}

go();
