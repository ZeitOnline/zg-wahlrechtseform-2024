import {useEffect, useState} from 'react';

export const useFetch = (url, options) => {
  const [response, setResponse] = useState(null);
  // const doFetch = options?.fetch
  let doFetch = true;
  if (options && 'fetch' in options && !options.fetch) {
    doFetch = false;
  }
  useEffect(() => {
    const loadData = async () => {
      console.log('fetching');
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        setResponse(json);
      } catch (err) {
        console.log(err);
      }
    };
    if (doFetch) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, doFetch]);

  return response;
};

export default useFetch;
