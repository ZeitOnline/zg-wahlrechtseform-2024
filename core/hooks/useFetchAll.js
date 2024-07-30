import {useEffect, useState} from 'react';

export const useFetchAll = (urls = [], options) => {
  const [responses, setResponses] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const allRequests = urls.map((url) =>
          fetch(url, options).then((response) =>
            url.match(/\.json/) ? response.json() : response.text(),
          ),
        );
        const responses = await Promise.all(allRequests);

        setResponses(responses);
      } catch (err) {
        console.log(err);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls]);

  return responses;
};

export default useFetchAll;
