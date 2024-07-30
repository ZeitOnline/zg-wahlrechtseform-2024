import { useEffect, useState, useLayoutEffect } from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

/**
 * Will set `overflow: hidden` to the body to make sure it's not
 * scrollable anymore, this is useful when a modal window is currently
 * active and visible.
 * Src: https://usehooks-ts.com/react-hook/use-locked-body
 * Usage: const [locked, setLocked] = useLockedBody();
 * @param {boolean=false} initialLocked If set to true, the body is initially locked
 * @returns {[boolean, function]} Returns both arguments of the `useState` hook
 */
function useLockedBody(initialLocked = false) {
  const [locked, setLocked] = useState(initialLocked);

  useIsomorphicLayoutEffect(() => {
    if (!locked) {
      return;
    }

    // Save initial body style
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get the scrollBar width
    const scrollBarWidth =
      typeof window === 'undefined'
        ? 0
        : window.innerWidth -
          document.getElementsByTagName('html')[0].clientWidth;

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Avoid width reflow
    if (scrollBarWidth) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;

      if (scrollBarWidth) {
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [locked]);

  // Update state if initialValue changes
  useEffect(() => {
    if (locked !== initialLocked) {
      setLocked(initialLocked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocked]);

  return [locked, setLocked];
}

export default useLockedBody;
