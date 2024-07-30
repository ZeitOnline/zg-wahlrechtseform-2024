import React from 'react';
import cx from 'classnames';

import Icon from 'src/static/images/zoom-in-icon.svg?react';

import cn from './index.module.scss';

const ZoomInControl = ({onClick}) => (
  <div
    className={cx('maplibregl-ctrl maplibregl-ctrl-group', cn.fitZoomButton)}
  >
    <button
      onClick={onClick}
      type="button"
      title="Heranzoomen"
      className="maplibregl-ctrl-icon"
    >
      <Icon />
    </button>
  </div>
);

export default ZoomInControl;
