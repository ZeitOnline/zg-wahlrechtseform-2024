import {useState, useCallback} from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

function useSize() {
  const [target, setTarget] = useState(null);
  const [size, setSize] = useState({width: null, height: null});

  const resizeCallback = useCallback(
    (entry) => {
      setSize({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      });
    },
    [setSize],
  );

  useIsomorphicLayoutEffect(() => {
    if (target) {
      const bbox = target.getBoundingClientRect();

      setSize({
        width: Math.round(bbox.width),
        height: Math.round(bbox.height),
      });
    } else {
      setSize({width: null, height: null});
    }
  }, [target]);

  useResizeObserver(target, resizeCallback);
  return [setTarget, size, target];
}

export default useSize;
