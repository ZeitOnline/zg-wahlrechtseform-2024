import debounce from 'lodash.debounce';
import {useEffect, useMemo, useRef} from 'react';

const useDebounce = (callback, ms = 500) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...args) => {
      ref.current?.(...args);
    };

    return debounce(func, ms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return debouncedCallback;
};

export default useDebounce;
