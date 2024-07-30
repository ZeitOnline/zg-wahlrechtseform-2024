import debouncePkg from 'debounce';
import clamp from 'core/utils/clamp.js';

export const {debounce} = debouncePkg;

export function getTop(el) {
  return el.offsetTop + (el.offsetParent && getTop(el.offsetParent));
}

export function toString(frame, nFrames, padLength) {
  return clamp(Math.round(frame), 1, nFrames)
    .toString()
    .padStart(padLength, '0');
}

export function preloadFirstBatch(preloadLimit, getImageUrl) {
  return () => {
    // create preload links – can be processed at the same time using http2
    // this way, the creation of the first batch in the image cache is way faster
    if (typeof window !== 'undefined') {
      const preloadLinks = document.createDocumentFragment();
      for (let i = 1; i <= preloadLimit; i++) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = getImageUrl(i, 'low');
        preloadLinks.appendChild(preloadLink);
      }
      document.head.appendChild(preloadLinks);
    }
  };
}

export function getCachedDirUrl(metaData) {
  const publicUrl = __PUBLIC_URL__;
  const isProd = import.meta.env.PROD;
  const isSSR = import.meta.env.SSR;

  return isProd || isSSR
    ? `${publicUrl}${metaData.folder}`
    : `http://${window.location.host}/${metaData.folder}`;
}

// returns 0 if a user has not yet scrolled beyond a scroller and max (nFrames) otherwise
export function isBefore(currentVideo, identifierInQuestion, allVideos) {
  return (
    allVideos.map((d) => d.identifier).indexOf(currentVideo.identifier) <
    allVideos.map((d) => d.identifier).indexOf(identifierInQuestion)
  );
}
