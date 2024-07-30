import React from 'react';
import {Marker} from 'react-map-gl/maplibre';

import cn from './index.module.scss';

const HomeMarker = ({position}) => {
  if (!position) {
    return null;
  }

  return (
    <Marker latitude={position[1]} longitude={position[0]}>
      <div className={cn.container}>
        <div className={cn.marker} />
      </div>
    </Marker>
  );
};

export default HomeMarker;
