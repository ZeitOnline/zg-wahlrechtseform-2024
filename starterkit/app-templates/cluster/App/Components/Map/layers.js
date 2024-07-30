import objectAssignDeep from 'object-assign-deep';

const getDefaultClusterPaint = (isDarkMode) => ({
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
  'circle-radius': 15,
  'circle-opacity': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    0.5,
    1,
  ],
});

export const getClusterLayerProps = (isDarkMode, config) => ({
  id: 'clusters',
  type: 'circle',
  source: 'cluster-source',
  filter: ['has', 'point_count'],
  paint: config?.clusterOptions?.getClusterPaint
    ? objectAssignDeep(
        getDefaultClusterPaint(isDarkMode),
        config.clusterOptions.getClusterPaint(isDarkMode),
      )
    : getDefaultClusterPaint(isDarkMode),
});

export const getClusterLayerCountProps = (isDarkMode, config) => ({
  id: 'cluster-count',
  type: 'symbol',
  source: 'cluster-source',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 14,
  },
  paint: {
    'text-color': isDarkMode ? '#000' : '#fff',
  },
});

const getDefaultUnclusteredPointPaint = (isDarkMode) => ({
  'circle-color': isDarkMode ? '#0DBE4B' : '#1CDF60',
  'circle-opacity': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    0.5,
    1,
  ],
  'circle-radius': 7,
  'circle-stroke-width': [
    'case',
    ['boolean', ['feature-state', 'click'], false],
    2,
    1,
  ],
  'circle-stroke-color': [
    'case',
    ['boolean', ['feature-state', 'click'], false],
    isDarkMode ? '#fff' : '#000',
    isDarkMode ? '#000' : '#fff',
  ],
});

export const getUnclusteredPointLayerProps = (isDarkMode, config) => ({
  id: 'unclustered-point',
  type: 'circle',
  source: 'cluster-source',
  filter: ['!', ['has', 'point_count']],
  paint: config?.clusterOptions?.unclusteredPointPaint
    ? objectAssignDeep(
        getDefaultUnclusteredPointPaint(isDarkMode),
        config.clusterOptions.unclusteredPointPaint(isDarkMode),
      )
    : getDefaultUnclusteredPointPaint(isDarkMode),
});
