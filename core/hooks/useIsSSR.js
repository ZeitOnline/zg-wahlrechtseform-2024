import {useEffect, useState} from 'react';

/**
 Returns true if rendering is being done on the server
 or the first render on the client,
 which has to return the same result as the server
 */
function useIsSSR() {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return isSSR;
}

export default useIsSSR;
