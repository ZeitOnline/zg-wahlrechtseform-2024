import {join} from 'path';

import {getParameterDefinition} from './embed.js';
import {getStarterkitConfig} from '../utils/starterkit.js';
import {viviDist} from '../paths.js';
import {DEFAULT_STATIC_ID} from '../constants.js';

const ERROR_TEXT = "'Grafik konnte nicht geladen werden'";

function getHtmlFileName(props) {
  if (props.length === 0) {
    return 'index.html"';
  }
  return (
    props.map((d) => `${d.name}_" ~ ${d.jinjaVarName} ~ `).join('"__') +
    '".html"'
  );
}

function getStaticIncludePath({
  deploymentPath,
  appName,
  id = 'module.params.id',
}) {
  const isStaging = process.env.STAGING;
  const base = isStaging ? '/interactive/g/staging' : '/interactive/g';
  return `"${base}/${deploymentPath}/static-html/includes/${appName}/" ~ ${id} ~ "`;
}

export async function generateStaticIncludeEmbedsForVivi(app) {
  const deploymentPath = getStarterkitConfig().deploymentPath;
  const appName = app.appName;
  let id;
  if (!app.getIdsForStaticIncludes) {
    id = `"${DEFAULT_STATIC_ID}"`;
  }
  const staticIncludePath = getStaticIncludePath({deploymentPath, appName, id});

  const propsWithoutId = app.staticIncludes.props.filter(
    (d) => d.name !== 'id',
  );
  const dynamicFilename = getHtmlFileName(propsWithoutId);

  const propsCustomJinjaCode = app.staticIncludes.props
    .filter((prop) => prop.customJinjaCode)
    .map((prop) => prop.customJinjaCode)
    .join('\n');

  const contentString = `{% import 'zeit.web.core:templates/macros/layout_macro.html' as lama %}

  ${propsCustomJinjaCode}

{{ lama.insert_esi(${staticIncludePath}/${dynamicFilename}, error_text=${ERROR_TEXT}) }}

{{ lama.insert_esi(${staticIncludePath}/body-includes.html", error_text=${ERROR_TEXT}) | include_in_body }}
{{ lama.insert_esi(${staticIncludePath}/head-includes.html", error_text=${ERROR_TEXT}) | include_in_head }}
  `;

  const {
    viviEmbedName,
    props,
    thirdPartyVendors,
    viviPath: viviPathOverride,
  } = app.staticIncludes;

  const viviPath =
    viviPathOverride || `administratives/embeds/${deploymentPath}/${appName}`;

  const parameterString = getParameterDefinition(props);

  return [
    {
      contentString,
      parameterString,
      viviName: viviEmbedName,
      viviPath,
      localPath: join(viviDist, appName),
      thirdPartyVendors,
    },
  ];
}
