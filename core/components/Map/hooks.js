import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';

export const MapContext = createContext({});

export function useMap() {
  return useContext(MapContext);
}

export function useHover() {
  const {setOnHover, node} = useMap();
  const [hoverProps, setHoverProps] = useState(null);

  const onHover = useCallback(
    ({event, feature, data}) => {
      if (!feature) {
        setHoverProps(null);
        return;
      }

      const bbox = node.getBoundingClientRect();

      const screenX = event.x;
      const screenY = event.y;

      const mapX = screenX - bbox.left; // Offset within container
      const mapY = screenY - bbox.top; // Offset within container

      setHoverProps({
        screenX,
        screenY,
        mapX,
        mapY,
        mapOffsetX: bbox.left,
        mapOffsetY: bbox.top,
        content: feature.properties,
        data,
        geojson: feature,
      });
    },
    [node],
  );

  useEffect(() => setOnHover(() => onHover), [onHover, setOnHover]);

  return hoverProps;
}
