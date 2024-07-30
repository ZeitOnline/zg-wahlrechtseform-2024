import {useState, useEffect} from 'react';

/**
 * Returns an array of [ref, isIntersecting, node]
 * @param {Object} params
 * @param {string} params.rootMargin
 * @param {Number[]} params.threshold
 */
const useIsVisible = function ({rootMargin = '0px', threshold = [0]} = {}) {
  const [target, setTarget] = useState(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    let currentRef = target;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold,
      },
    );
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [target, rootMargin, threshold]);

  return [setTarget, isIntersecting, target];
};

export default useIsVisible;
