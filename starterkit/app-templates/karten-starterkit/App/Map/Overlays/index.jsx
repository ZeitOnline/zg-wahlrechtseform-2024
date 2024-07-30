import React from 'react';

import GeoJSONLayer from '../GeoJSONLayer';

export default function Overlays({map, id, overlays, beforeId}) {
  if (typeof overlays === 'undefined' || (overlays && !overlays.length)) {
    return null;
  }

  return overlays.map((overlay, i) => {
    const key = `${id}__${i}`;

    return (
      <GeoJSONLayer
        key={key}
        id={key}
        map={map}
        source={overlay.file}
        maxZoom={overlay.maxZoom}
        styles={overlay.styles}
        beforeId={beforeId}
      />
    );
  });
}
