import {useState, useEffect, useCallback} from 'react';
import debounce from 'debounce';

const useDimensions = function (initialSize = {width: null, height: null}) {
  const [size, setSize] = useState(initialSize);
  const [node, setNode] = useState(null);

  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      window.requestAnimationFrame(() => {
        if (node) {
          setSize({
            width: node.clientWidth,
            height: node.clientHeight,
          });
        }
      });
    };
    const debouncedHandleResize = debounce(handleResize, 100);

    handleResize();

    window.addEventListener('resize', debouncedHandleResize);
    window.addEventListener('orientationchange', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      window.removeEventListener('orientationchange', debouncedHandleResize);
    };
  }, [node]);

  return [ref, size, node];
};

export default useDimensions;
