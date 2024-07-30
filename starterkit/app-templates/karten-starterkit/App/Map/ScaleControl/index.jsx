import {useEffect} from 'react';
import {ScaleControl} from 'maplibre-gl';

const ZonScaleControl = ({map, isVisible}) => {
  useEffect(() => {
    if (map && isVisible) {
      const scale = new ScaleControl({
        maxWidth: 80,
        unit: 'metric',
      });

      map.addControl(scale);
    }
  }, [map, isVisible]);

  return null;
};

export default ZonScaleControl;
