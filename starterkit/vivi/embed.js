import {join} from 'path';

import {viviDist} from '../paths.js';
import propsToJinja2 from './props-to-jinja2.js';
import render from '../render/index.js';
import {
  getStylesheets,
  getPreloads,
  getScriptTags,
  getHeadScriptTags,
  getScriptTagsNoPreload,
} from '../utils/manifest-utils.js';
import {log} from '../utils/logging.js';

export function getParameterDefinition(props) {
  if (!props) {
    return null;
  }

  const definitions = props
    .filter((prop) => prop.parameterString)
    .map((prop) => {
      return `(
      "${prop.name}",
      ${prop.parameterString},
    )`;
    })
    .join(',\n    ');

  return `collections.OrderedDict(
  [
    ${definitions}
  ]
)`;
}

export function getCombinationsForProps(props) {
  if (!props || !props.length) {
    return [];
  }
  const iterableProps = props.filter((prop) => prop.iterate);
  if (!iterableProps.length) {
    return null;
  }
  // @TODO: write this so it doesn’t rely on [0]
  let combinations = iterableProps[0].iterate.map((value) => {
    return [
      {
        prop: iterableProps[0],
        value,
      },
    ];
  });

  for (let index = 1; index < iterableProps.length; index++) {
    const prop = iterableProps[index];
    let newCombinations = [];
    for (const value of prop.iterate) {
      newCombinations = newCombinations.concat(
        combinations.map((combination) => {
          return [
            ...combination,
            {
              prop,
              value,
            },
          ];
        }),
      );
    }

    combinations = newCombinations;
  }
  return combinations;
}

export async function generateViviEmbedsForApp(app) {
  const viviEmbeds = [];
  for (const {
    name,
    excludeJS = false,
    excludeStyles = false,
    props,
    thirdPartyVendors,
    disableSSRBuild,
    viviPath: viviPathOverride,
  } of app.viviEmbeds) {
    const {appName, appId, cpPreload} = app;
    const viviPath =
      viviPathOverride || `administratives/embeds/deploymentPath/${appName}`;

    log('use prop combinations to create jinja code...');
    let contentString = propsToJinja2({viviEmbedName: name, props, app});

    if (!disableSSRBuild) {
      try {
        contentString = await render({
          appId,
          App: app,
          html: contentString,
        });
      } catch (e) {
        console.error(e.stack);
        return null;
      }
    }

    log(`include style, preloads, scripts...`);
    const styleTags = getStylesheets(appName);
    const preloadTags = getPreloads(appName);
    const scriptTags = getScriptTags(appName);
    const scriptTagsNoPreload = getScriptTagsNoPreload(appName);
    const headScriptTags = getHeadScriptTags(appName);
    const styles = excludeStyles
      ? ['']
      : styleTags.map((d) => `{{ '${d}' | include_in_head }}`);
    const preloads = excludeJS
      ? ['']
      : preloadTags.map((d) => `{{ '${d}' | include_in_preload }}`);
    const scripts = excludeJS
      ? ['']
      : scriptTags.map((d) => `{{ '${d}' | include_in_body }}`);
    const scriptsNoPreload = excludeJS
      ? ['']
      : scriptTagsNoPreload.map((d) => `{{ '${d}' | include_in_body }}`);
    const headScripts = excludeJS
      ? ['']
      : headScriptTags.map((d) => `{{ '${d}' | include_in_head }}`);

    // on cp/hp, we don’t want to preload module scripts, we use normal scripts for everything
    const conditionalPreload = `{% if provides(context, 'zeit.content.article.interfaces.IArticle') %}
    ${scripts.join('\n  ')}
    ${preloads.join('\n ')}
  {% else %}
    ${scriptsNoPreload.join('\n ')}
  {% endif %}`;

    contentString = `${contentString}
${styles.join('\n')}
${cpPreload ? [...scripts, ...preloads].join('\n') : conditionalPreload}
${headScripts.join('\n')}
    `;

    viviEmbeds.push({
      contentString,
      parameterString: getParameterDefinition(props),
      viviName: name,
      app,
      viviPath,
      localPath: join(viviDist, app.appName),
      props,
      thirdPartyVendors,
      propCombinations: getCombinationsForProps(props),
    });
  }

  return viviEmbeds;
}
