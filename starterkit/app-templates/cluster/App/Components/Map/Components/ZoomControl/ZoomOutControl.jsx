import React from 'react';
import cx from 'classnames';

import Icon from 'src/static/images/zoom-out-icon.svg?react';

import cn from './index.module.scss';

const ZoomOutControl = ({onClick}) => (
  <div className={cx('mapboxgl-ctrl mapboxgl-ctrl-group', cn.fitZoomButton)}>
    <button
      onClick={onClick}
      type="button"
      title="Herauszoomen"
      className="mapboxgl-ctrl-icon"
    >
      <Icon />
    </button>
  </div>
);

export default ZoomOutControl;
