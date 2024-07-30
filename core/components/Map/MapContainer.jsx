import PropTypes from 'prop-types';
import {useMemo, useState} from 'react';
import {geoPath, geoMercator} from 'd3-geo';
import rewind from '@mapbox/geojson-rewind';

import useSize from 'core/hooks/useSize.js';
import useCachedFetch from 'core/hooks/useCachedFetch.js';
import useTopoJson from 'core/hooks/useTopoJson.js';
import {MapContext} from './hooks.js';
import {geoPathReducePrecision} from 'core/utils/geo.js';

const fetchOptions = {cache: 'force-cache'};

const DEFAULT_GEO_KEY_GETTER = (feature) => feature.properties.id;

/**
 * SVG/HTML map
 */
function Map({
  topoJson: customTopoJson,
  topoJsonUrl,
  projection = geoMercator(),
  children,
  padding: customPadding,
  className,
  id,
  width: customWidth,
  height: customHeight,
  geoKeyGetter = DEFAULT_GEO_KEY_GETTER,
  bounds,
  processTopoJson,
  pathPrecision,
}) {
  const padding = useMemo(() => {
    return {
      top: 3,
      bottom: 3,
      left: 3,
      right: 3,
      ...customPadding,
    };
  }, [customPadding]);

  const [useSizeRef, dimensions, node] = useSize();
  const {width = 0, height = 0} = dimensions;

  /*
      @TODO: Cache useTopoJson
  */
  let topoJson = customTopoJson;
  const {response: loadedTopoJson} = useCachedFetch(topoJsonUrl, fetchOptions);
  if (!topoJson && loadedTopoJson) {
    topoJson = loadedTopoJson;
  }
  const geoData = useTopoJson({topoJson, processTopoJson, geoKeyGetter});

  const [onHover, setOnHover] = useState();

  const contextValue = useMemo(() => {
    const dimensions = {
      width: customWidth || width,
      height: customHeight || height,
    };

    let scaledProjection = () => [0, 0];
    let path = () => '';
    let pathWithReducedPrecision = () => '';

    if (projection) {
      scaledProjection = projection.fitSize(
        [
          dimensions.width - padding.left - padding.right,
          dimensions.height - padding.top - padding.bottom,
        ],
        bounds
          ? rewind(
              {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'Polygon',
                      coordinates: [bounds],
                    },
                  },
                ],
              },
              true,
            )
          : geoData.outline,
      );
      path = geoPath().projection(scaledProjection);
      pathWithReducedPrecision = (geom, precision) => {
        if (!precision && !pathPrecision) {
          return path(geom);
        }
        return geoPathReducePrecision(path(geom), precision || pathPrecision);
      };
    }

    return {
      geoData,
      projection: scaledProjection,
      pathPrecision,
      path,
      pathWithReducedPrecision,
      dimensions,
      bounds: geoData.bounds,
      padding,
      node,
      id,
      geoKeyGetter,
      onHover,
      setOnHover,
    };
  }, [
    customWidth,
    width,
    customHeight,
    height,
    projection,
    geoData,
    pathPrecision,
    padding,
    node,
    id,
    geoKeyGetter,
    onHover,
    bounds,
  ]);

  // const finalWidth = customWidth || width;
  // const finalHeight = customHeight || height;

  return (
    <div className={className} ref={useSizeRef}>
      <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
    </div>
  );
}

Map.propTypes = {
  /** topoJson to show */
  topoJson: PropTypes.object,
  /** topoJson url to load */
  topoJsonUrl: PropTypes.string,
  projection: PropTypes.func,
  padding: PropTypes.shape({
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    bottom: PropTypes.number,
  }),
  className: PropTypes.string,
  id: PropTypes.string,
  /** custom width, measures its dimensions by default */
  width: PropTypes.number,
  /** custom height, measures its dimensions by default */
  height: PropTypes.number,
  /** used to get keys from the geo data, receives the feature */
  geoKeyGetter: PropTypes.func,
  /** optional bounds, uses bounds from topojson by default */
  bounds: PropTypes.arrayOf(PropTypes.number),
  processTopoJson: PropTypes.func,
  /** number of decimals in SVG paths, use e.g. for server side rendering */
  pathPrecision: PropTypes.number,
};

export default Map;
