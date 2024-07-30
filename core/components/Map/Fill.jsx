import PropTypes from 'prop-types';
import {memo} from 'react';
import cx from 'classnames';

import {useMap} from './hooks.js';
import cn from './Fill.module.scss';

/**
 * Draws a filled area
 */
function Fill({filterFeaturesFn, className, precision}) {
  const {geoData, pathWithReducedPrecision} = useMap();
  return (
    <g className={cn.container}>
      <path
        d={pathWithReducedPrecision(
          {
            type: 'FeatureCollection',
            features: geoData.features.filter(filterFeaturesFn),
          },
          precision,
        )}
        className={cx(cn.fill, className)}
      />
    </g>
  );
}

Fill.propTypes = {
  // custom geojson
  fill: PropTypes.object,
  className: PropTypes.string,
  precision: PropTypes.number,
};

export default memo(Fill);
