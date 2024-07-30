import {kebabCase} from 'change-case';

import {trim} from '../utils/utils.js';
import {
  DATA_RENDER_ATTR,
  DATA_PROP_ATTR,
  DATA_NAME_ATTR,
} from '../constants.js';

function renderDiv({propValues, nonIfProps, appId, viviEmbedName}) {
  const nonIfPropValues = nonIfProps.map((prop) => {
    let escape = '';
    const name = prop.jinjaVarName || `module.params.${prop.name}`;

    if ('escape' in prop && prop.escape === false) {
      escape = '| safe ';
    }
    let value = `{{ ${name} ${escape}}}`;
    if (prop.static || prop.value) {
      value = prop.value;
    }
    return {
      prop,
      value,
    };
  });
  const propStrings = [...propValues, ...nonIfPropValues].map((d) => {
    // remove quotation marks around value
    const value = trim(d.value, '"');
    let quote = '"';
    if (d.prop.valueInSingleQuotes) {
      quote = "'";
    }
    return `${DATA_PROP_ATTR}-${kebabCase(
      d.prop.name,
    )}=${quote}${value}${quote}`;
  });

  return `<div ${DATA_RENDER_ATTR}="${appId}" ${DATA_NAME_ATTR}="${viviEmbedName}" ${propStrings.join(
    ' ',
  )}></div>`;
}

function renderRecursively({
  propsToGo,
  propValues = [],
  nonIfProps,
  appName,
  appId,
  viviEmbedName,
}) {
  if (!propsToGo.length) {
    return renderDiv({propValues, nonIfProps, appId, viviEmbedName});
  }

  let completeTemplate = '';

  const prop = propsToGo[0];

  for (const [i, value] of prop.iterate.entries()) {
    let iterationString = '';
    const nextPropsToGo = propsToGo.slice(1);
    const nextPropValues = [...propValues, {prop, value}];

    const ifCondition = `${prop.jinjaVarName} == ${value}`;

    const ifOpening = i === 0 ? '{% if' : '{% elif';
    let ifString = `${ifOpening} ${ifCondition} %}`;
    if (prop.iterateIfElse && i === 1 && prop.iterate.length === 2) {
      ifString = '{% else %}';
    }

    const content = renderRecursively({
      propsToGo: nextPropsToGo,
      propValues: nextPropValues,
      nonIfProps,
      appName,
      appId,
      viviEmbedName,
    });

    iterationString = `${ifString}
  ${content}`;
    completeTemplate = `${completeTemplate}
${iterationString}`;
  }
  return `${completeTemplate}
{% endif %}`;
}

function propsToJinja2({viviEmbedName, app, props = []}) {
  const propsToPutInIfs = props.filter((d) => d.iterate);
  const otherProps = props.filter((d) => !d.iterate);

  const template = renderRecursively({
    propsToGo: propsToPutInIfs,
    nonIfProps: otherProps,
    appName: app.appName,
    appId: app.appId,
    viviEmbedName,
  });

  const customJinjaCode = props
    .filter((d) => d.customJinjaCode)
    .map((d) => d.customJinjaCode)
    .join('\n');

  return `${customJinjaCode}
${template}
  `;
}

export default propsToJinja2;
