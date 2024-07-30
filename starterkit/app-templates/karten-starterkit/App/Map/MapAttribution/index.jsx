import {useEffect} from 'react';
import {AttributionControl} from 'maplibre-gl';

const ZonAttributionControl = ({map}) => {
  useEffect(() => {
    if (map) {
      map.addControl(
        new AttributionControl({
          compact: true,
        }),
      );
    }
  }, [map]);

  return null;
};

export default ZonAttributionControl;
