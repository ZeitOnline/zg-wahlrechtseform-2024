import {useEffect} from 'react';

function useViviImages() {
  useEffect(() => {
    document
      .querySelectorAll('img[data-src^="https://friedbert-preview.zeit.de"]')
      .forEach((d) => {
        d.loading = 'lazy';
        if (import.meta.env.DEV)
          d.src = d.dataset.source.replace('friedbert-preview', 'img');
        else d.src = d.dataset.source;
        d.removeAttribute('height');
        d.removeAttribute('width');
      });
  }, []);
}

export default useViviImages;
