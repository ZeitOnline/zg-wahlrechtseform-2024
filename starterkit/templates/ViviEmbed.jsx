import PropTypes from 'prop-types';
import {useContext} from 'react';
import {kebabCase} from 'change-case';

import {
  DATA_RENDER_ATTR,
  DATA_PROP_ATTR,
  PLACEHOLDER_APP_NAME,
  DATA_NAME_ATTR,
} from 'starterkit/constants.js';
import {jsBoolToPython} from 'starterkit/vivi/utils.js';

import {ViviContext} from './FakeViviProvider.jsx';

function ViviEmbed(props) {
  const {paywall, pagetype, app, rebrush} = useContext(ViviContext);

  let mappedNamedEmbeds = {};
  if (app?.viviEmbeds) {
    mappedNamedEmbeds = app.viviEmbeds.reduce((mappedNamedEmbeds, embed) => {
      return {
        ...mappedNamedEmbeds,
        [embed.name]: embed,
      };
    }, {});
  }
  if (app?.staticIncludes) {
    mappedNamedEmbeds[app.staticIncludes.viviEmbedName] = app.staticIncludes;
  }

  const embed = mappedNamedEmbeds[props.name];
  let propsToMap = props;
  if (props.name && embed?.props) {
    propsToMap = embed?.props
      .filter((prop) => prop.static || prop.compute)
      .reduce((propsToMap, prop) => {
        if (prop.compute) {
          prop.value = prop.compute(props);
        }
        return {
          ...propsToMap,
          [prop.name]: prop.value,
        };
      }, propsToMap);
  }

  const mappedProps = Object.entries(propsToMap).reduce(
    (mappedProps, [key, value]) => {
      let fixedValue = value;
      let keyValue = `${DATA_PROP_ATTR}-${key}`;
      if (key === 'name') {
        keyValue = `${DATA_NAME_ATTR}`;
      }
      keyValue = kebabCase(keyValue);
      if ([true, false].includes(value)) {
        fixedValue = jsBoolToPython(value);
      }
      return {...mappedProps, [keyValue]: fixedValue};
    },
    {
      [DATA_RENDER_ATTR]: __PROJECT_PREFIX__ + '-' + PLACEHOLDER_APP_NAME,
    },
  );

  // add special props only if requested
  if (hasProp(embed, 'isTruncatedByPaywall')) {
    mappedProps[`${DATA_PROP_ATTR}-is-truncated-by-paywall`] = paywall
      ? 'True'
      : 'False';
  }
  if (hasProp(embed, 'pagetype')) {
    mappedProps[`${DATA_PROP_ATTR}-pagetype`] = pagetype;
  }
  if (hasProp(embed, 'isRebrush')) {
    mappedProps[`${DATA_PROP_ATTR}-pagetype`] = pagetype;
  }

  return <div {...mappedProps} />;
}

function hasProp(embed, propName) {
  return embed?.props.find((d) => d.name == propName);
}

ViviEmbed.propTypes = {
  /** Name that you gave the embed in the top level `index.jsx` of your app */
  name: PropTypes.string,
};

export default ViviEmbed;
