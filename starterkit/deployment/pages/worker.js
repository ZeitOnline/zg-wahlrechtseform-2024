import {writeFile, mkdir} from 'fs/promises';
import {expose} from 'threads/worker';
import {join, parse, relative} from 'path';

import {dist} from '../../paths.js';

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import {DEFAULT_STATIC_ID} from '../../constants.js';
import render, {
  getPropsForStaticIncludesHydrationScript,
  replaceRenderDataProp,
} from '../../render/index.js';

async function renderPage({
  app,
  Component,
  staticProps,
  id,
  appId,
  styleTags,
  scriptTags,
  headScriptTags,
  preloadTags,
}) {
  let hydrationTag = '';
  if (id && staticProps) {
    hydrationTag = await getPropsForStaticIncludesHydrationScript({
      appId,
      id,
      staticProps,
      encrypt: app?.staticIncludes?.encryptHydrationData,
    });
  }

  let html = renderToStaticMarkup(
    React.createElement(Component, {...staticProps, id}),
  )
    .replace('</body>', `\n${scriptTags.join('\n')}</body>`)
    .replace('</head>', `\n${preloadTags.join('\n')}</head>`)
    .replace('</head>', `\n${styleTags.join('\n')}</head>`)
    .replace('</head>', `\n${headScriptTags.join('\n')}</head>`);

  if (hydrationTag) {
    html = html.replace('</head>', `${hydrationTag}\n</head>`);
  }
  html = replaceRenderDataProp({html, appId});

  try {
    html = await render({
      appId,
      App: app,
      html,
      id,
      staticProps,
      isDocument: true,
    });
  } catch (e) {
    console.error(e.stack);
    return null;
  }

  return html;
}

expose(async function writePages({
  appName,
  styleTags,
  scriptTags,
  headScriptTags,
  preloadTags,
  staticIds,
  path,
}) {
  const appModule = await import(join(dist, 'node', `${appName}.mjs`));
  const app = appModule.default;
  const page = appModule.pages[path];

  const appLocalDir = app.appName === 'index' ? '' : app.appName;

  for await (const id of staticIds) {
    const filename = `${parse(path).name}.html`;
    const idDir = id === DEFAULT_STATIC_ID ? '' : id;
    const localPath = join(dist, 'static-html', appLocalDir, idDir);
    console.log(`generating page ${relative(dist, join(localPath, filename))}`);

    let staticProps = {};
    if (app.getPropsForStaticIncludes) {
      staticProps = await app.getPropsForStaticIncludes(id);
    }

    const contentString = await renderPage({
      app,
      appId: app.appId,
      Component: page.default,
      staticProps,
      id,
      styleTags,
      scriptTags,
      headScriptTags,
      preloadTags,
    });

    await mkdir(localPath, {recursive: true});

    await writeFile(join(localPath, filename), contentString);
  }
});
