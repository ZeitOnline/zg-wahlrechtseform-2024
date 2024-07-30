import {useEffect, useState} from 'react';

const cachedData = new Map();

export const useCachedFetchAll = (urls = [], options) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allRequests = urls.map(async (url) => {
          if (cachedData.has(url)) {
            return cachedData.get(url);
          } else {
            const response = await fetch(url, options);
            const responseData = await response.json();
            cachedData.set(url, responseData);
            return responseData;
          }
        });

        const responses = await Promise.all(allRequests);
        setResponses(responses);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls]);

  return {responses, loading};
};

export default useCachedFetchAll;
