import {merge} from 'lodash-es';

import copy from 'core/utils/deepCopy.js';

const waterColor = 'hsl(196,19%,89%)';
const waterColorDark = 'hsl(250,10%,20%)';
const greenColor = 'hsl(140,19%,95%)';
const greenColorDark = 'hsl(140,10%,20%)';
const boundaryColor = 'rgba(0, 0, 0, 0.5)';
const roadColor = 'rgba(200,200,200,1)';
const roadColorDark = 'rgba(55,55,55,1)';
const railwayColor = 'rgba(180,180,180,1)';
const railwayColorDark = 'rgba(75,75,75,1)';
const railwayDashlineColor = 'rgba(255,255,255,0.8)';
const railwayDashlineColorDark = 'rgba(0,0,0,0.8)';

const placeLabelStyle = {
  'text-color': 'rgba(0,0,0,0.9)',
  'text-halo-color': 'rgba(255,255,255, 0.95)',
  'text-halo-blur': 0,
  'text-halo-width': 2,
};
const placeLabelStyleDark = {
  'text-color': 'rgba(255,255,255,0.9)',
  'text-halo-color': 'rgba(0,0,0, 0.95)',
  'text-halo-blur': 0,
  'text-halo-width': 2,
};
// const waterLabelStyle = {
//   'text-color': '#6FA6B9',
//   'text-halo-color': 'rgba(255,255,255, 0.6)',
//   'text-halo-blur': 0,
//   'text-halo-width': 1.5,
// };

const basemapStyle = {
  version: 8,
  name: 'ZeitOnlineMapStarterStyle',
  metadata: {
    'mapbox:autocomposite': false,
    'mapbox:type': 'template',
    'mapbox:groups': {
      b6371a3f2f5a9932464fa3867530a2e5: {
        name: 'Transportation',
        collapsed: false,
      },
      a14c9607bc7954ba1df7205bf660433f: {
        name: 'Boundaries',
      },
      '101da9f13b64a08fa4b6ac1168e89e5f': {
        name: 'Places',
        collapsed: false,
      },
    },
    'openmaptiles:version': '3.x',
    'openmaptiles:mapbox:owner': 'openmaptiles',
    'openmaptiles:mapbox:source:url': 'mapbox://openmaptiles.4qljc88t',
    'maptiler:copyright':
      'This style was generated on MapTiler Cloud. Usage outside of MapTiler Cloud requires valid OpenMapTiles Production Package: https://openmaptiles.com/production-package/ -- please contact us.',
  },
  sources: {
    openmaptiles: {
      type: 'vector',
      url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=97rApSj6Cex7Q3i1vFjt',
      // tiles: [
      //   'https://interactive.zeit.de/g/maptiles/osm_germany_v1/{z}/{x}/{y}.pbf',
      // ],
    },
    maptiler_attribution: {
      type: 'vector',
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    },
    'terrain-rgb': {
      type: 'raster-dem',
      url: 'https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=97rApSj6Cex7Q3i1vFjt',
    },
  },
  glyphs:
    'https://interactive.zeit.de/TabletGothic.nogzip/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'above_hillshade',
      type: 'hillshade',
      source: 'terrain-rgb',
      layout: {
        visibility: 'visible',
      },
      minzoom: 0,
      paint: {
        'hillshade-highlight-color': '#ffffff',
        'hillshade-shadow-color': '#151515',
        'hillshade-exaggeration': 0.6,
      },
    },
    {
      id: 'ocean',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      filter: ['all', ['==', '$type', 'Polygon'], ['==', 'class', 'ocean']],
      paint: {
        'fill-color': waterColor,
      },
      dark: {
        paint: {
          'fill-color': waterColorDark,
        },
      },
    },
    // {
    //   id: 'landcover_grass',
    //   type: 'fill',
    //   source: 'openmaptiles',
    //   'source-layer': 'landcover',
    //   paint: {
    //     'fill-color': greenColor,
    //     'fill-opacity': 1,
    //   },
    //   dark: {
    //     paint: {
    //       'fill-color': greenColorDark,
    //     },
    //   },
    //   filter: ['any', ['==', 'class', 'grass'], ['==', 'class', 'wood']],
    // },
    {
      id: 'above_lakes',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'class', 'ocean']],
      paint: {
        'fill-color': waterColor,
      },
      dark: {
        paint: {
          'fill-color': waterColorDark,
        },
      },
    },
    {
      id: 'above_waterway',
      filter: ['==', '$type', 'LineString'],
      minzoom: 7,
      paint: {
        'line-color': waterColor,
      },
      source: 'openmaptiles',
      'source-layer': 'waterway',
      type: 'line',
      dark: {
        paint: {
          'line-color': waterColorDark,
        },
      },
    },
    // {
    //   id: 'above_water_name',
    //   filter: ['==', '$type', 'LineString'],
    //   layout: {
    //     'symbol-placement': 'line',
    //     'symbol-spacing': 500,
    //     'text-field': '{name}',
    //     'text-font': ['TabletGothicRegular'],
    //     'text-rotation-alignment': 'map',
    //     'text-size': 14,
    //     'text-letter-spacing': 0.03,
    //   },
    //   paint: placeLabelStyle,
    //   source: 'openmaptiles',
    //   'source-layer': 'water_name',
    //   type: 'symbol',
    // },
    {
      id: 'above_boundary_state',
      minzoom: 7,
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: ['==', 'admin_level', 4],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'visible',
      },
      paint: {
        'line-color': {
          stops: [
            [7.49, '#77777c'],
            [7.5, '#fff'],
          ],
        },
        'line-width': {
          base: 1.3,
          stops: [
            [7, 1.2],
            [22, 15],
          ],
        },
        'line-opacity': 1,
      },
    },
    {
      id: 'above_boundary_country',
      minzoom: 7,
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: ['all', ['==', 'admin_level', 2], ['==', 'maritime', 0]],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#77777c',
        'line-width': {
          base: 1.1,
          stops: [
            [8, 2],
            [22, 20],
          ],
        },
      },
    },
    // {
    //   id: 'above_highway_minor',
    //   filter: [
    //     'all',
    //     ['==', '$type', 'LineString'],
    //     ['in', 'class', 'minor', 'service', 'track'],
    //   ],
    //   layout: {
    //     'line-cap': 'round',
    //     'line-join': 'round',
    //   },
    //   minzoom: 8,
    //   paint: {
    //     'line-color': roadColor,
    //     'line-width': {
    //       base: 1.55,
    //       stops: [
    //         [13, 0.5],
    //         [20, 8],
    //       ],
    //     },
    //   },
    //   source: 'openmaptiles',
    //   'source-layer': 'transportation',
    //   type: 'line',
    //   dark: {
    //     paint: {
    //       'line-color': roadColorDark,
    //     },
    //   },
    // },
    {
      id: 'above_highway_major',
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        ['in', 'class', 'primary', 'secondary', 'tertiary', 'trunk'],
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      minzoom: 8,
      paint: {
        'line-color': roadColor,
        'line-width': {
          base: 1.3,
          stops: [
            [8, 0.5],
            [20, 10],
          ],
        },
      },
      source: 'openmaptiles',
      'source-layer': 'transportation',
      type: 'line',
      dark: {
        paint: {
          'line-color': roadColorDark,
        },
      },
    },
    {
      id: 'above_highway_motorway',
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        ['==', 'class', 'motorway'],
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      minzoom: 6,
      paint: {
        'line-color': roadColor,
        'line-width': {
          base: 1.4,
          stops: [
            [7, 0.8],
            [20, 15],
          ],
        },
      },
      source: 'openmaptiles',
      'source-layer': 'transportation',
      type: 'line',
      dark: {
        paint: {
          'line-color': roadColorDark,
        },
      },
    },
    {
      id: 'above_railway',
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        ['==', 'class', 'rail'],
        ['!has', 'service'],
      ],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      minzoom: 7,
      paint: {
        'line-color': railwayColor,
        'line-width': {
          base: 1.3,
          stops: [
            [7, 0.5],
            [20, 8],
          ],
        },
      },
      source: 'openmaptiles',
      'source-layer': 'transportation',
      type: 'line',
      dark: {
        paint: {
          'line-color': railwayColorDark,
        },
      },
    },
    {
      id: 'above_railway_dashline',
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        ['==', 'class', 'rail'],
        ['!has', 'service'],
      ],
      layout: {
        'line-join': 'round',
      },
      minzoom: 9,
      paint: {
        'line-color': railwayDashlineColor,
        'line-dasharray': [3, 3],
        'line-width': {
          base: 1.3,
          stops: [
            [9, 0.5],
            [20, 7],
          ],
        },
      },
      source: 'openmaptiles',
      'source-layer': 'transportation',
      type: 'line',
      dark: {
        paint: {
          'line-color': railwayDashlineColorDark,
        },
      },
    },
    {
      id: 'above_highway_name_motorway',
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        ['==', 'class', 'motorway'],
      ],
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 350,
        'text-field': '{ref}',
        'text-font': ['TabletGothicBold'],
        'text-pitch-alignment': 'viewport',
        'text-rotation-alignment': 'viewport',
        'text-size': 9,
        'text-letter-spacing': 0.05,
      },
      minzoom: 7,
      paint: placeLabelStyle,
      source: 'openmaptiles',
      'source-layer': 'transportation_name',
      type: 'symbol',
      dark: {
        paint: placeLabelStyleDark,
      },
    },
    {
      id: 'above_road_major_label',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'transportation_name',
      minzoom: 12,
      filter: ['==', '$type', 'LineString'],
      layout: {
        'symbol-placement': 'line',
        'text-field': '{name:latin} {name:nonlatin}',
        'text-font': ['TabletGothicRegular'],
        'text-size': 10,
        'text-letter-spacing': 0.03,
        'text-rotation-alignment': 'map',
        visibility: 'visible',
      },
      paint: placeLabelStyle,
      dark: {
        paint: placeLabelStyleDark,
      },
    },
    {
      id: 'boundary_country',
      filter: ['all', ['==', 'admin_level', 2], ['==', 'maritime', 0]],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-blur': {
          base: 1,
          stops: [
            [0, 0.4],
            [22, 4],
          ],
        },
        'line-color': boundaryColor,
        'line-width': {
          base: 1.1,
          stops: [
            [3, 1],
            [22, 20],
          ],
        },
      },
      source: 'openmaptiles',
      'source-layer': 'boundary',
      type: 'line',
    },
    // {
    //   id: 'above_waterway-label',
    //   type: 'symbol',
    //   source: 'openmaptiles',
    //   'source-layer': 'waterway',
    //   filter: ['all', ['==', 'class', 'river']],
    //   layout: {
    //     'text-anchor': 'center',
    //     'text-font': ['TabletGothicRegular'],
    //     'text-offset': [0.5, 0],
    //     'text-size': 12,
    //     'text-letter-spacing': 0.03,
    //     'text-field': '{name_de}',
    //     'text-pitch-alignment': 'map',
    //     'text-rotation-alignment': 'map',
    //     'text-justify': 'center',
    //     'icon-rotation-alignment': 'map',
    //     'icon-pitch-alignment': 'map',
    //   },
    //   paint: waterLabelStyle,
    // },
    {
      id: 'above_place_other',
      filter: [
        'all',
        ['==', '$type', 'Point'],
        ['in', 'class', 'hamlet', 'isolated_dwelling', 'neighbourhood'],
      ],
      layout: {
        'text-anchor': 'center',
        'text-field': '{name}',
        'text-font': ['TabletGothicRegular'],
        'text-justify': 'center',
        'text-offset': [0.5, 0],
        'text-size': 14,
        'text-letter-spacing': 0.03,
      },
      maxzoom: 14,
      paint: placeLabelStyle,
      source: 'openmaptiles',
      'source-layer': 'place',
      type: 'symbol',
    },
    {
      id: 'above_place_suburb',
      filter: ['all', ['==', '$type', 'Point'], ['==', 'class', 'suburb']],
      layout: {
        'text-anchor': 'center',
        'text-field': '{name}',
        'text-font': ['TabletGothicRegular'],
        'text-justify': 'center',
        'text-offset': [0.5, 0],
        'text-size': 14,
        'text-letter-spacing': 0.03,
      },
      maxzoom: 15,
      paint: placeLabelStyle,
      source: 'openmaptiles',
      'source-layer': 'place',
      type: 'symbol',
      dark: {
        paint: placeLabelStyleDark,
      },
    },
    {
      id: 'above_place_village',
      filter: ['all', ['==', '$type', 'Point'], ['==', 'class', 'village']],
      layout: {
        'icon-size': 0.4,
        'text-anchor': 'center',
        'text-field': '{name}',
        'text-font': ['TabletGothicRegular'],
        'text-justify': 'left',
        'text-offset': [0.5, 0.2],
        'text-size': 14,
        'text-letter-spacing': 0.03,
      },
      maxzoom: 14,
      paint: placeLabelStyle,
      dark: {
        paint: placeLabelStyleDark,
      },
      source: 'openmaptiles',
      'source-layer': 'place',
      type: 'symbol',
    },
    {
      id: 'above_place_town',
      filter: ['all', ['==', '$type', 'Point'], ['==', 'class', 'town']],
      layout: {
        'icon-size': 0.4,
        'text-anchor': 'center',
        'text-field': '{name}',
        'text-font': ['TabletGothicRegular'],
        'text-justify': 'left',
        'text-offset': [0.5, 0.2],
        'text-size': 14,
        'text-letter-spacing': 0.03,
      },
      maxzoom: 15,
      paint: placeLabelStyle,
      dark: {
        paint: placeLabelStyleDark,
      },
      source: 'openmaptiles',
      'source-layer': 'place',
      type: 'symbol',
    },
    {
      id: 'above_place_city',
      filter: [
        'all',
        ['==', '$type', 'Point'],
        ['==', 'class', 'city'],
        ['>', 'rank', 3],
      ],
      layout: {
        'icon-size': 0.4,
        'text-anchor': 'center',
        'text-field': '{name}',
        'text-font': ['TabletGothicRegular'],
        'text-justify': 'left',
        'text-offset': [0.5, 0.2],
        'text-size': 16,
        'text-letter-spacing': 0.03,
      },
      maxzoom: 14,
      paint: placeLabelStyle,
      source: 'openmaptiles',
      'source-layer': 'place',
      type: 'symbol',
      dark: {
        paint: placeLabelStyleDark,
      },
    },
    {
      id: 'above_place_city_large',
      filter: [
        'all',
        ['==', '$type', 'Point'],
        ['<=', 'rank', 3],
        ['==', 'class', 'city'],
      ],
      layout: {
        'icon-size': 0.4,
        'text-anchor': 'center',
        'text-field': '{name}',
        'text-font': ['TabletGothicRegular'],
        'text-justify': 'left',
        'text-offset': [0.5, 0.2],
        'text-size': 18,
        'text-letter-spacing': 0.03,
      },
      maxzoom: 12,
      paint: placeLabelStyle,
      source: 'openmaptiles',
      'source-layer': 'place',
      type: 'symbol',
      dark: {
        paint: placeLabelStyleDark,
      },
    },
    // {
    //   id: 'above_place_state',
    //   filter: ['all', ['==', '$type', 'Point'], ['==', 'class', 'state']],
    //   layout: {
    //     'text-field': '{name}',
    //     'text-font': ['TabletGothicRegular'],
    //     'text-size': 14,
    //     'text-letter-spacing': 0.03,
    //   },
    //   maxzoom: 12,
    //   paint: placeLabelStyle,
    //   source: 'openmaptiles',
    //   'source-layer': 'place',
    //   type: 'symbol',
    //   dark: {
    //     paint: placeLabelStyleDark,
    //   },
    // },
    // {
    //   id: 'above_place_country_other',
    //   filter: [
    //     'all',
    //     ['==', '$type', 'Point'],
    //     ['==', 'class', 'country'],
    //     ['!has', 'iso_a2'],
    //   ],
    //   layout: {
    //     'text-field': '{name:de}',
    //     'text-transform': 'uppercase',
    //     'text-font': ['TabletGothicBold'],
    //     'text-size': 18,
    //     'text-letter-spacing': 0.03,
    //   },
    //   maxzoom: 8,
    //   paint: placeLabelStyle,
    //   source: 'openmaptiles',
    //   'source-layer': 'place',
    //   type: 'symbol',
    //   dark: {
    //     paint: placeLabelStyleDark,
    //   },
    // },
    // {
    //   id: 'above_place_country_minor',
    //   filter: [
    //     'all',
    //     ['==', '$type', 'Point'],
    //     ['==', 'class', 'country'],
    //     ['>=', 'rank', 2],
    //     ['has', 'iso_a2'],
    //   ],
    //   layout: {
    //     'text-field': '{name:de}',
    //     'text-transform': 'uppercase',
    //     'text-font': ['TabletGothicBold'],
    //     'text-size': 16,
    //     'text-letter-spacing': 0.03,
    //   },
    //   maxzoom: 8,
    //   paint: placeLabelStyle,
    //   source: 'openmaptiles',
    //   'source-layer': 'place',
    //   type: 'symbol',
    //   dark: {
    //     paint: placeLabelStyleDark,
    //   },
    // },
    // {
    //   id: 'above_place_country_major',
    //   filter: [
    //     'all',
    //     ['==', '$type', 'Point'],
    //     ['<=', 'rank', 1],
    //     ['==', 'class', 'country'],
    //     ['has', 'iso_a2'],
    //   ],
    //   layout: {
    //     'text-anchor': 'center',
    //     'text-field': '{name:de}',
    //     'text-transform': 'uppercase',
    //     'text-font': ['TabletGothicBold'],
    //     'text-size': 20,
    //     'text-letter-spacing': 0.03,
    //   },
    //   maxzoom: 6,
    //   paint: placeLabelStyle,
    //   source: 'openmaptiles',
    //   'source-layer': 'place',
    //   type: 'symbol',
    //   dark: {
    //     paint: placeLabelStyleDark,
    //   },
    // },
  ],
  id: '7baf2c44-a667-4675-a23d-6762b5ac8ea5',
  center: [50, 10],
  zoom: 6,
  bearing: 0,
  pitch: 0,
};

export default {
  light: basemapStyle,
  dark: {
    ...basemapStyle,
    layers: copy(basemapStyle.layers).map((layer) => {
      if (layer.dark) {
        return merge(layer, layer.dark);
      }
      return layer;
    }),
  },
};
