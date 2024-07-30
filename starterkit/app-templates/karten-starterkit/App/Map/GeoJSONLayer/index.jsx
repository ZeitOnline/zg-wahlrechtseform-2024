import React from 'react';
import {Layer, Source} from 'react-map-gl/maplibre';

import useCachedFetch from 'core/hooks/useCachedFetch.js';
import useTopoJson from 'core/hooks/useTopoJson.js';
import useIsDarkMode from 'core/hooks/useIsDarkMode';

const defaultStyles = {
  light: {
    color: '#fff',
    opacity: 1,
    weight: 1,
  },
  dark: {
    color: '#1e1c1f',
    opacity: 0.8,
    weight: 1,
  },
};

const fetchOptions = {cache: 'force-cache'};

const GeoJSONLayer = ({
  source,
  map,
  id = 'geojson-layer',
  styles = {},
  paint = {},
  layout = {},
  minZoom = 0,
  maxZoom = 21,
  beforeId,
}) => {
  const isDarkMode = useIsDarkMode();
  const layerStyles = Object.assign(
    {},
    defaultStyles[isDarkMode ? 'dark' : 'light'],
    styles[isDarkMode ? 'dark' : 'light'],
  );

  let topoJson = null;
  const {response: loadedTopoJson} = useCachedFetch(source, fetchOptions);
  if (!topoJson && loadedTopoJson) {
    topoJson = loadedTopoJson;
  }
  const data = useTopoJson({topoJson});

  if (!data || !map) {
    return null;
  }

  const mesh = data?.mesh || {type: 'MultiLineString', coordinates: []};
  return (
    <Source id={`source-${id}`} type="geojson" data={mesh}>
      <Layer
        id={id}
        minzoom={minZoom}
        maxzoom={maxZoom}
        type="line"
        paint={{
          'line-color': layerStyles.color,
          'line-opacity': layerStyles.opacity || 1,
          'line-width': layerStyles.weight,
          ...paint,
        }}
        layout={layout}
        beforeId={beforeId}
      />
    </Source>
  );
};

export default GeoJSONLayer;
