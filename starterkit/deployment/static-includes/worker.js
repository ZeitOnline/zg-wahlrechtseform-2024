import {join} from 'path';
import {writeFile, mkdir} from 'fs/promises';
import {expose} from 'threads/worker';
import {kebabCase} from 'change-case';

import {DATA_RENDER_ATTR, DATA_PROP_ATTR} from '../../constants.js';
import {dist} from '../../paths.js';
import render, {
  getPropsForStaticIncludesHydrationScript,
} from '../../render/index.js';
import {trim} from '../../utils/utils.js';

function getStaticIncludeFileName(combination) {
  if (combination.length === 0) {
    return 'index.html';
  }
  return (
    combination
      .map((d) => {
        // remove quotation marks around value
        const value = trim(d.value, '"');
        return `${d.prop.name}_${value}`;
      })
      .join('__') + '.html'
  );
}

async function doTheJob({combination, appId, staticProps, app, id, localPath}) {
  // create static includes for prop combinations

  let propStrings = '';
  if (combination) {
    propStrings = combination
      .map((d) => `${DATA_PROP_ATTR}-${kebabCase(d.prop.name)}=${d.value}`)
      .join(' ');
  }

  let html = `<div ${DATA_RENDER_ATTR}="${appId}" ${propStrings}></div>`;

  try {
    html = await render({
      appId,
      App: app,
      html,
      id,
      addStaticPropsToWindow: false,
      staticProps,
    });
  } catch (e) {
    console.error(`error for ${id}`);
    console.error(e.stack);
    return null;
  }

  const fileName = getStaticIncludeFileName(combination);

  return {
    contentString: html,
    fileName,
    localPath,
  };
}

expose(async function writeStaticIncludes({
  appName,
  appId,
  propCombinations = [],
  styleTags,
  scriptTags,
  headScriptTags,
  preloadTags,
  staticIds,
}) {
  const appModule = await import(join(dist, 'node', `${appName}.mjs`));
  const app = appModule.default;

  for await (const id of staticIds) {
    console.log(
      `${appName}:${id} generating static includes `, //(${i}/${staticIds.length})`,
    );

    let staticProps = {};
    if (app.getPropsForStaticIncludes) {
      staticProps = await app.getPropsForStaticIncludes(id);
    }
    let staticIncludesForId = [];
    const localPath = join(dist, 'static-html', 'includes', appName, id);

    // create static includes for css, js and hydration data
    // two embeds; one for the header, one for the body
    // not more, to reduce the number of files
    let headContent = '';
    if (styleTags.length) {
      headContent = styleTags.join('\n');
    }
    if (preloadTags.length) {
      headContent += '\n' + preloadTags.join('\n');
    }
    if (headScriptTags.length) {
      headContent += '\n' + headScriptTags.join('\n');
    }

    const propsForStaticIncludesHydrationScript =
      await getPropsForStaticIncludesHydrationScript({
        appId,
        id,
        staticProps,
        encrypt: app?.staticIncludes?.encryptHydrationData,
      });
    if (propsForStaticIncludesHydrationScript.length) {
      headContent += '\n' + propsForStaticIncludesHydrationScript;
    }
    staticIncludesForId.push({
      contentString: headContent,
      localPath,
      fileName: 'head-includes.html',
    });
    staticIncludesForId.push({
      contentString: scriptTags.join('\n'),
      localPath,
      fileName: 'body-includes.html',
    });

    for (const combination of propCombinations) {
      const staticInclude = await doTheJob({
        combination,
        appId,
        staticProps,
        app,
        id,
        localPath,
      });
      if (!staticInclude) {
        staticIncludesForId = [];
        break;
      }
      staticIncludesForId.push(staticInclude);
    }
    if (!propCombinations || !propCombinations.length) {
      const staticInclude = await doTheJob({
        appId,
        staticProps,
        app,
        id,
        localPath,
      });
      if (!staticInclude) {
        staticIncludesForId = [];
        break;
      }
      staticIncludesForId.push(staticInclude);
    }

    if (staticIncludesForId?.length) {
      await mkdir(localPath, {recursive: true});
    }
    for await (const file of staticIncludesForId) {
      writeFile(join(file.localPath, file.fileName), file.contentString);
    }
  }
});
