const worldDesktop = [-148.7, -58.7, 160.1, 69.2];

const exampleCircle = {
  id: 'circle-highlight',
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [
      {type: 'Feature', geometry: {type: 'Point', coordinates: [89.51, 42.86]}},
    ],
  },
  dataLayer: {
    type: 'circle',
    paint: {
      'circle-color': 'transparent',
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 1.5,
      'circle-radius': 40,
    },
    beforeId: 'country-label-dark',
  },
};

const defaultWaypoint = {
  id: 'default',
  label: 'Standardansicht',
  layers: [],
  legend: true,
  mapBoxLayers: ['example-mapbox-layer'],
  bounds: worldDesktop,
  customAttribution: 'Quelle',
};

const config = {
  waypoints: [
    defaultWaypoint,
    {
      ...defaultWaypoint,
      id: 'step-one',
      label: 'Schritt 1',
      boundsMobile: [-121.7, -43.8, 155.6, 70.7],
      boundsDesktop: [-120, -40, 170, 80],
    },
    {
      ...defaultWaypoint,
      id: 'step-two',
      label: 'Schritt 2',
      bounds: [-8.4, 50.5, 19.7, 62.6],
    },
    {
      ...defaultWaypoint,
      id: 'step-three',
      label: 'Schritt 3',
      bounds: [-8.4, 50.5, 19.7, 62.6],
      interactive: true,
    },
  ],
  hidableMapBoxLayers: ['example-mapbox-layer'],
  visualizationLayers: [exampleCircle],
};

export default config;
