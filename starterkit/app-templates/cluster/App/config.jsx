import {asPublicUrl} from './utils';

import {IS_MOBILE} from 'core/utils/env';

const config = {
  // GENERAL CONFIGURATION
  // url to the csv file containing the point data
  // has to include at least the following columns:
  // name, lat/latitude, lng/longitude
  csvUrl: asPublicUrl('cluster.csv'),
  // function to prepare data for the map
  // e.g. rename columns, add new columns, etc.
  // should return an array of objects
  cleanData: (data) => data,

  // MAP
  mapOptions: {
    // light style url
    lightStyleUrl: 'mapbox://styles/zeitonline/cljgx3s6o00d901qu4hfsar3b',
    // dark style url
    darkStyleUrl: 'mapbox://styles/zeitonline/cljmofof4008201pmfim90kq5',
    // bounds of the map
    bounds: [5.98865807458, 47.3024876979, 15.1169958839, 54.983104153],
    // min zoom level the map can be zoomed out
    minZoom: 4,
    // max zoom level the map can be zoomed in
    maxZoom: 11,
  },

  // CLUSTERING
  clusterOptions: {
    // minimum zoom level at which clusters are generated
    minZoom: null,
    // maximum zoom level at which clusters are generated
    maxZoom: 14,
    // cluster radius in pixels
    radius: IS_MOBILE ? 35 : 50,
    // function to create cluster paint properties; gets passed isDarkMode
    getClusterPaint: (isDarkMode) => ({
      'circle-color': isDarkMode
        ? [
            'step',
            ['get', 'point_count'],
            '#057A29',
            5,
            '#0DBE4B',
            10,
            '#1CDF60',
            15,
            '#59F18E',
          ]
        : [
            'step',
            ['get', 'point_count'],
            '#59F18E',
            5,
            '#1CDF60',
            10,
            '#0DBE4B',
            15,
            '#057A29',
          ],
    }),
    // function to create unclustered point paint properties; gets passed isDarkMode
    getPointPaint: (isDarkMode) => ({
      'circle-color': isDarkMode ? '#0DBE4B' : '#1CDF60',
      'circle-stroke-color': [
        'case',
        ['boolean', ['feature-state', 'click'], false],
        isDarkMode ? '#fff' : '#000',
        isDarkMode ? '#000' : '#fff',
      ],
    }),
  },

  // TOOLTIPS
  tooltipOptions: {
    // standard tooltip component shown on hover (desktop) or click (mobile)
    // all props from main data csv (config.csvUrl) are passed to the component
    condensedTooltip: ({name, lat, lng}) => <>{name}</>,
    // extended tooltip component shown on click (desktop) or click on button (mobile)
    // all props from main data csv (config.csvUrl) are passed to the component
    expandedTooltip: ({name, lat, lng}) => (
      <>
        {name} <br /> {lat} <br /> {lng}
      </>
    ),
    // message shown when cluster is hovered
    clusterTooltip: 'Klicken für alle Hofläden an diesem Ort',
  },

  // GEOCODING
  geocoderOptions: {
    // whether to use the static or dynamic geocoder
    useStaticOrDynamic: 'static',
    // options passed to the static geocoder
    staticOptions: {
      // url to a csv file containing lat, lon and name columns for the autocomplete
      // has to be placed in the public folder
      url: asPublicUrl('kreise-centroids.csv'),
    },
    // options passed to the dynamic geocoder
    // by default the geocoder searchs for countries,
    // regions, postcodes, districts, places, localities
    // and neighbourhoods. For possible options see:
    // https://docs.mapbox.com/api/search/geocoding/
    dynamicOptions: {
      // language expected by the geocoder
      language: 'de',
      // country to limit the search to, e.g.: de
      country: null,
      // limit the search to a specific bounding box, e.g.: [5.98865807458, 47.3024876979, 15.1169958839, 54.983104153]
      bbox: null,
      // additional geocoder types to include in the search, e.g.: ['poi']
      types: null,
    },
    // call to action displayed above the search bar
    callToAction: '',
    // placeholder text
    placeholder: 'Suchen Sie Ihren Kreis ...',
  },
};

export default config;
