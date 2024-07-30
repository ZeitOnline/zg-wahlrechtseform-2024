import {useMemo} from 'react';

import useIsSSR from './useIsSSR';

function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function getHashFromSsoId(ssoId) {
  return cyrb53(ssoId).toString();
}

function useUser() {
  const isSSR = useIsSSR();

  const returnValue = useMemo(() => {
    if (isSSR) {
      return {};
    }
    const ssoId = window.Zeit?.user?.ssoid;
    const isSubscribed = window.Zeit?.user?.hasAbo;
    let id = null;
    if (ssoId) {
      id = getHashFromSsoId(ssoId);
    } else {
      id = localStorage.getItem('duvId');
      if (!id) {
        id = getHashFromSsoId(Math.random().toString(36));
        localStorage.setItem('duvId', id);
      }
      id = `duvId:${id}`;
    }
    return {
      ssoId,
      isSubscribed,
      id,
    };
  }, [isSSR]);

  return returnValue;
}

export default useUser;
