import {feature} from 'topojson-client';
import SphericalMercator from '@mapbox/sphericalmercator';

const blankMapStyle = {
  version: 8,
  name: 'zon-blank',
  metadata: {},
  center: [7.752220000032253, 48.573330000022764],
  zoom: 13,
  bearing: 0,
  pitch: 0,
  sources: {},
  layers: [],
  created: '2016-12-06T14:41:50.283Z',
  id: 'ciwdm6n54002d2qmv0ma01u2y',
  modified: '2018-12-12T08:46:22.476Z',
  owner: 'zeitonline',
  visibility: 'private',
  draft: false,
};

const publicUrl = __PUBLIC_URL__;
const isProd = import.meta.env.PROD;
const isSSR = import.meta.env.SSR;
const baseUrl =
  isProd || isSSR ? `${publicUrl}` : `http://${window.location.host}/`;

export const noop = () => {};
export const CHOROPLETH_LAYER_ID_PREFIX = 'choropleth-layer';

export const assignMapStyle = (currentStyle, newStyle) => {
  newStyle.sources = Object.assign({}, newStyle.sources, currentStyle.sources);
  newStyle.layers = newStyle.layers.concat(currentStyle.layers);
  return newStyle;
};

export function getChoroplethLayerId(layerOptions) {
  return `${CHOROPLETH_LAYER_ID_PREFIX}-${layerOptions.id}`;
}

export function numberFormat(num, decimals, suffix = '', prefix = '') {
  if (typeof decimals === 'number') {
    num = num.toFixed(decimals);
    num = num.replace(',', '.');
  } else if (typeof num === 'string') {
    num = +num.replace(',', '.');
  }

  let y = num.toString().split('.');

  if (num > 999) {
    y[0] = y[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const result = y.join(',');
  const prefixedResult = prefix ? `${prefix}${result} ` : result;

  return suffix ? `${prefixedResult} ${suffix}` : prefixedResult;
}

export const getAspectRatio = (bounds) => {
  const coords = new SphericalMercator().xyz(bounds, 20);
  const xDistance = coords.maxX - coords.minX;
  const yDistance = coords.maxY - coords.minY;

  return yDistance / xDistance;
};

export const parseMetaData = (metaData) => {
  console.log(metaData);
  // metaData.json = JSON.parse(metaData.json);
  metaData.bounds = metaData.bounds.split(',').map((coord) => +coord);
  metaData.center = metaData.center.split(',').map((coord) => +coord);

  return metaData;
};

export const topoToGeo = (topoData) => {
  if (!topoData) {
    return null;
  }

  const topojsonObjectKeys = Object.keys(topoData.objects);

  if (!topojsonObjectKeys || !topojsonObjectKeys.length) {
    console.log('error: topojson geodata file seems to be broken.');
    return false;
  }

  return feature(topoData, topoData.objects[topojsonObjectKeys[0]]);
};

export const getDefaultOptions = () => {
  return {
    title: '',
    interactiveMap: false,
    zoomControl: false,
    initialZoomButton: false,
    basemap: {
      style: blankMapStyle,
      hidden: [],
      alwaysVisible: false,
    },
    geodataOverlay: {
      file: null,
    },
    view: null,
    labels: {
      preset: '',
      data: null,
    },
    tooltip: {
      isVisible: false,
    },
    swoopies: [],
  };
};

// takes a template string 'here is <%SOME_VAR%>' and properties { SOME_VAR: 123, ANOTHER_VAR: 312 }
// and then replaces the vars with the passed properties
export function replaceWithProps(
  templateString = '',
  properties = {},
  formatting = false,
  error,
  forceError = false,
) {
  let string = templateString;
  const reg = /<%(.*?)%>/g;
  let match;
  let offset = 0;

  if (forceError) {
    return error;
  }

  while ((match = reg.exec(templateString)) !== null) {
    if (
      typeof properties[match[1]] === 'undefined' ||
      properties[match[1]] === null
    ) {
      return error;
    } else {
      const start = match.index;
      const original = match[0];
      const end = start + original.length;
      let replacement = properties[match[1]];
      if (
        typeof formatting === 'object' &&
        formatting.formatNumber &&
        typeof replacement === 'number'
      ) {
        let decimals = formatting.decimals;
        if (typeof decimals === 'object') {
          if (Object.hasOwn(decimals, match[1])) {
            decimals = decimals[match[1]];
          } else if (decimals.default) {
            decimals = decimals.default;
          } else {
            decimals = 1;
          }
        }
        replacement = numberFormat(replacement, decimals);
      }
      string =
        string.substr(0, start + offset) +
        replacement +
        string.substr(end + offset);
      offset += replacement.length - original.length;
    }
  }
  return string;
}

export function sortByKey(key, isAsc = true) {
  return (a, b) => {
    if (a[key] < b[key]) {
      return isAsc ? -1 : 1;
    } else if (a[key] > b[key]) {
      return isAsc ? 1 : -1;
    } else {
      return 0;
    }
  };
}

const bundeslaender = {
  1: 'Schleswig-Holstein',
  2: 'Hamburg',
  3: 'Niedersachsen',
  4: 'Bremen',
  5: 'Nordrhein-Westfalen',
  6: 'Hessen',
  7: 'Rheinland-Pfalz',
  8: 'Baden-Württemberg ',
  9: 'Bayern',
  10: 'Saarland',
  11: 'Berlin',
  12: 'Brandenburg',
  13: 'Mecklenburg-Vorpommern',
  14: 'Sachsen',
  15: 'Sachsen-Anhalt',
  16: 'Thüringen',
};

export function getBundeslandById(wbz) {
  if (!wbz) {
    return null;
  }
  if (wbz.length < 8 && wbz.length % 2 === 0 && !wbz.startsWith('0')) {
    return bundeslaender[+wbz.substring(0, 1)] || null;
  }
  return bundeslaender[+wbz.substring(0, 2)] || null;
}

export function parseProps(props) {
  props.bundesland = getBundeslandById(props.AGS);
  return props;
}

let _getSourceUrl = function (src) {
  let srcUrl = src;
  if (srcUrl.startsWith('zon-tiles://')) {
    srcUrl = srcUrl.replace('zon-tiles://', `${baseUrl}maptiles/`);
  }
  return srcUrl;
};

if (import.meta.env.dev) {
  // use window.location.host
  // so you can test on a mobile device
  _getSourceUrl = function (src) {
    let srcUrl = src;
    if (srcUrl.startsWith('zon-tiles://')) {
      srcUrl = srcUrl.replace(
        'zon-tiles://',
        `http://${window.location.host}${baseUrl}maptiles/`,
      );
    }
    return srcUrl;
  };
}

export const getSourceUrl = _getSourceUrl;

export const getCurrentMapBounds = (map) => {
  const bounds = map.getBounds().toArray();
  return [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]];
};

export default {
  numberFormat,
  parseMetaData,
  topoToGeo,
  getDefaultOptions,
  replaceWithProps,
  sortByKey,
  noop,
  getCurrentMapBounds,
};
