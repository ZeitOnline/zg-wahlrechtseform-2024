import {useReducer, useRef} from 'react';
import Loader from 'core/components/Loader';
import useInterval from 'core/hooks/useInterval';
import {useVideoProgress} from '../VideoProgressor/store';
import usePrevious from 'core/hooks/usePrevious';

const defaultCache = {current: []};

/**
 * This loader renders only if a user is scrolling too fast and below
 * the number of pictures that have been precached successfully.
 */
function CustomizedLoader({imageCache = defaultCache}) {
  const progressRef = useRef(null);
  useVideoProgress(progressRef);
  const prevY = usePrevious(progressRef.current);

  // TODO: implement
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const isLoading =
    progressRef.current - prevY > 25 &&
    progressRef.current > imageCache.current?.length;

  useInterval(forceUpdate, 1000);

  return (
    <Loader
      isLoading={isLoading}
      style={{color: 'white'}}
      width={50}
      height={50}
    />
  );
}

export default CustomizedLoader;
