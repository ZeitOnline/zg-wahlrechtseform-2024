import cx from 'classnames';

import GLMap from './GLMap';
import cn from './index.module.scss';
import useSize from 'core/hooks/useSize';
import {useWaypoint} from '../ScrollProgressor/store';

function MapWrapper() {
  const [sizeRef, dimensions] = useSize();
  const waypoint = useWaypoint();
  const legend = waypoint?.legend ? (
    <div className={cn.legendContainer}>
      <h5 className={cn.legendTitle}>Legende</h5>
    </div>
  ) : null;

  return (
    <div ref={sizeRef} className={cn.wrapper}>
      {dimensions.width > 300 && <GLMap {...dimensions} />}
      {legend}
    </div>
  );
}

export default MapWrapper;
