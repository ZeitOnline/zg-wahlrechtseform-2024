import PropTypes from 'prop-types';
import {memo} from 'react';
import cx from 'classnames';

import {useMap} from './hooks.js';
import cn from './Border.module.scss';

/**
 * Draws a border path
 */
function Border({border: customBorder, className, precision}) {
  const {geoData, pathWithReducedPrecision} = useMap();

  let border = customBorder;
  if (!border && geoData.mesh) {
    border = geoData.mesh;
  }

  return (
    <g className={cn.container}>
      <path
        d={pathWithReducedPrecision(border, precision)}
        className={cx(cn.border, className)}
      />
    </g>
  );
}

Border.propTypes = {
  // custom geojson
  border: PropTypes.object,
  className: PropTypes.string,
  precision: PropTypes.number,
};

export default memo(Border);
