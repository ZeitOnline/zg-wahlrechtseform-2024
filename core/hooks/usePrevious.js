import { useEffect, useRef } from 'react';

/**
 * Hook that stores a value within a `ref`. This is useful if you want to
 * compare a new state to what it was during the last render execution.
 * Works best with strings and numbers, objects and arrays should be memoized.
 * @param {any} value Value to be stored
 * @returns {any}
 */
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
export default usePrevious;
