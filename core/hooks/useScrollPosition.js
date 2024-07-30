import { useState, useEffect } from 'react';

const isBrowser = typeof window !== `undefined`;

/**
 * Hook that returns `false` on init and then returns `true` after the user
 * has scrolled down more than a certain number of pixels. It will return `false`
 * again once the user scrolls back to the top.
 * @param {number} min Number of pixels that the window has to be scrolled
 * @returns {boolean} `false` on init and `true` if window is below `min`
 */
export function useScrollYPositionIsAbove(min = 300) {
  const [state, setState] = useState(false);
  const { y } = useScrollPosition();
  useEffect(() => {
    if (y > min !== state) {
      setState(y > min);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, y]);
  return state;
}

function getScrollPosition() {
  return isBrowser
    ? { x: window.pageXOffset, y: window.pageYOffset }
    : { x: 0, y: 0 };
}

export function useScrollPosition() {
  const [position, setScrollPosition] = useState(getScrollPosition());

  useEffect(() => {
    let requestRunning = null;
    function handleScroll() {
      if (isBrowser && requestRunning === null) {
        requestRunning = window.requestAnimationFrame(() => {
          setScrollPosition(getScrollPosition());
          requestRunning = null;
        });
      }
    }

    if (isBrowser) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return position;
}

export function useScrollXPosition() {
  const { x } = useScrollPosition();
  return x;
}

export function useScrollYPosition() {
  const { y } = useScrollPosition();
  return y;
}
