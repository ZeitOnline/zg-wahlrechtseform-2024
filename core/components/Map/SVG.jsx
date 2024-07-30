import cx from 'classnames';

import {useMap} from './hooks.js';
import cn from './SVG.module.scss';

/**
 * Wrapper for the maps’ SVG elements
 */
function SVG({className, children}) {
  const {dimensions} = useMap();

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      className={cx(cn.container, className)}
    >
      {children}
    </svg>
  );
}

export default SVG;
