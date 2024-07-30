import {useState, useEffect} from 'react';

const defaultThreshold = [0];
const useWasVisible = function (
  ref,
  {rootMargin = '0px', threshold = defaultThreshold},
) {
  const [wasVisible, setWasVisible] = useState(false);

  useEffect(() => {
    let currentRef = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWasVisible(true);
          observer.unobserve(currentRef);
        }
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
      observer.unobserve(currentRef);
      setWasVisible(false);
    };
  }, [ref, rootMargin, threshold]);

  return wasVisible;
};

export default useWasVisible;
