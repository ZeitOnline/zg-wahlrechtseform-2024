import {useEffect, useCallback} from 'react';

const Debugger = ({map}) => {
  const onClick = useCallback(
    (e) => {
      if (map) {
        const features = map.queryRenderedFeatures(e.point);
        features.forEach(function (feature) {
          console.log(feature, feature.properties);
        });
      }
    },
    [map],
  );
  const onMoveEnd = useCallback(() => {
    if (map) {
      const zoom = map.getZoom();
      const bounds = map.getBounds();
      const center = map.getCenter();
      console.log(
        JSON.stringify({
          zoom: +zoom.toFixed(2),
          longitude: +center.lng.toFixed(2),
          latitude: +center.lat.toFixed(2),
        }),
      );
      console.log(
        JSON.stringify([
          [bounds._sw.lng, bounds._sw.lat].map((d) => +d.toFixed(2)),
          [bounds._ne.lng, bounds._ne.lat].map((d) => +d.toFixed(2)),
        ]),
      );
    }
  }, [map]);

  useEffect(() => {
    if (map && import.meta.env.DEV) map.on('click', onClick);
    if (map && import.meta.env.DEV) map.on('moveend', onMoveEnd);
  }, [map, onClick, onMoveEnd]);

  return null;
};

export default Debugger;
