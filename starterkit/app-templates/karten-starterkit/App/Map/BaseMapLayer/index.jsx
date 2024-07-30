import {useEffect, useState} from 'react';

const BaseMapLayer = ({map, ignoreLayers, visible}) => {
  const [isVisible, setVisibility] = useState(false);

  useEffect(() => {
    if (map) {
      try {
        map.getStyle().layers.forEach((layer) => {
          if (
            ignoreLayers.every((layerName) => !layer.id.includes(layerName))
          ) {
            map.setLayoutProperty(
              layer.id,
              'visibility',
              isVisible ? 'visible' : 'none',
            );
          }
          if (layer.id.startsWith('above_')) {
            map.moveLayer(layer.id);
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [isVisible, map, ignoreLayers]);

  useEffect(() => {
    setVisibility(visible);
  }, [visible]);

  return null;
};

export default BaseMapLayer;
