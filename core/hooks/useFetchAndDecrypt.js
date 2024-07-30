import {useEffect, useState} from 'react';
import {decrypt} from 'core/utils/crypto.js';

export const useFetchAndDecrypt = (url, options) => {
  const [response, setResponse] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(url, options);
        const text = await res.text();
        let decrypted = await decrypt(text);
        if (options?.json) {
          decrypted = JSON.parse(decrypted);
        }
        setResponse(decrypted);
      } catch (err) {
        console.log(err);
      }
    };
    loadData();
  }, [url, options]);

  return response;
};

export default useFetchAndDecrypt;
