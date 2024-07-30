import {useMemo} from 'react';
import useMediaQuery from './useMediaQuery';

/**
 * This is basically a copy of our sass breakoints but in a Javascript way.
 * It will return true if a given media query matches, so for example for
 * `tablet`, and `min` and a screen width of 1000px it will return `true`.
 * @param {"modern-phone"|"large-phone"|"phablet"|"tablet"|"desktop"} device the identifier we also use in Sass breakpoints
 * @param {"min"|"max"} limit Either min or max for min-width or max-width
 * @returns
 */
function useBreakpoint(device = 'tablet', limit = 'min') {
  const matchMedia = useMemo(() => {
    switch (`${device}-${limit}`) {
      case 'modern-phone-max':
        return '(max-width: 22.499em)';
      case 'modern-phone-min':
        return '(min-width: 22.5em)';
      case 'large-phone-max':
        return '(max-width: 24.374em)';
      case 'large-phone-min':
        return '(min-width: 24.375em)';
      case 'phablet-max':
        return '(max-width: 32.499em)';
      case 'phablet-min':
        return '(min-width: 32.5em)';
      case 'tablet-max':
        return '(max-width: 47.999em)';
      case 'tablet-min':
        return '(min-width: 48em)';
      case 'desktop-max':
        return '(max-width: 61.249em)';
      case 'desktop-min':
        return '(min-width: 61.25em)';
    }
  }, [device, limit]);

  return useMediaQuery(matchMedia);
}

export default useBreakpoint;
