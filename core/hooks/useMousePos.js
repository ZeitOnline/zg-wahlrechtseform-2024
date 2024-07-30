import {useCallback, useEffect, useState} from 'react';

export const emptyPos = {top: undefined, left: undefined};

/**
 * Custom hook that tracks the mouse position within a specified parent element.
 * @param {React.RefObject} parentRef - Reference to the parent element.
 * @returns {Array} An array containing the mouse position object and the bounds object.
 * @example const parentRef = useRef(null); const [mousePos, bounds] = useMousePos(parentRef);
 */
function useMousePos(parentRef) {
  const [mousePos, setMousePos] = useState(emptyPos);
  const [bounds, setBounds] = useState(emptyPos);

  const handleMouseMove = useCallback(
    (evt) => {
      const {clientX, clientY} = evt;
      if (!isValidPos(bounds)) setMousePos(emptyPos);
      const left = clientX - bounds.left;
      const top = clientY - bounds.top;
      if (left >= 0 && left <= bounds.width && top >= 0 && top <= bounds.height)
        setMousePos({left, top});
    },
    [bounds],
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos(emptyPos);
  }, []);

  const refreshBounds = useCallback(() => {
    const parent = parentRef.current;
    if (!parent) {
      setBounds(emptyPos);
      return;
    }
    const newBounds = parentRef?.current?.getBoundingClientRect();
    if (
      isValidPos(newBounds) &&
      (!isValidPos(bounds) ||
        Math.abs(newBounds.left - bounds.left) > 1 ||
        Math.abs(newBounds.top - bounds.top) > 1 ||
        Math.abs(newBounds.width - bounds.width) > 1 ||
        Math.abs(newBounds.height - bounds.height) > 1)
    ) {
      setBounds({
        top: Math.round(newBounds.top),
        left: Math.round(newBounds.left),
        width: Math.round(newBounds.width),
        height: Math.round(newBounds.height),
      });
    }
  }, [bounds, parentRef]);

  useEffect(() => {
    // add event listeners
    const parent = parentRef.current;
    if (!parent) return;
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('scroll', refreshBounds);
    window.addEventListener('resize', refreshBounds);
    refreshBounds();

    return () => {
      // remove event listeners
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('scroll', refreshBounds);
      window.removeEventListener('resize', refreshBounds);
    };
  }, [handleMouseLeave, handleMouseMove, refreshBounds, parentRef]);

  return [mousePos, bounds];
}

export default useMousePos;

/**
 * Checks if the given position object is valid.
 * @param {Object} pos - The position object to check.
 * @returns {boolean} True if the position object is valid, false otherwise.
 */
export function isValidPos(pos) {
  return isFinite(pos?.left) && isFinite(pos?.top);
}
