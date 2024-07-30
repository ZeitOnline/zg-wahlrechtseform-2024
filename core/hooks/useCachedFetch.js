import {useEffect, useState} from 'react';

const cachedData = new Map();

function useFetch(url, options) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, options);
        let responseData = null;
        if (url.match(/\.json/)) {
          responseData = await res.json();
        } else {
          responseData = await res.text();
        }
        setResponse(responseData);
        setLoading(false);
        cachedData.add(url, responseData);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (!url) {
      return;
    }

    if (cachedData.has(url)) {
      setResponse(cachedData.get(url));
    } else {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return {response, error, loading};
}

export default useFetch;
