import React from 'react';
import cx from 'classnames';

import Icon from 'src/static/images/placeholder-small.svg?react';

import cn from './index.module.scss';

const ZoomOutControl = ({onClick}) => (
  <div
    className={cx('maplibregl-ctrl maplibregl-ctrl-group', cn.fitZoomButton)}
  >
    <button
      onClick={onClick}
      type="button"
      title="Ganz Deutschland zeigen"
      className="maplibregl-ctrl-icon"
    >
      <Icon />
    </button>
  </div>
);

export default ZoomOutControl;
