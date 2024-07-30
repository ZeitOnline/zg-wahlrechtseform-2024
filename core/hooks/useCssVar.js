import getCssVar from 'core/utils/getCssVar';
import {useState} from 'react';
import useIsDarkMode from './useIsDarkMode';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

/**
 * Hook that will return the value of a given css variable and
 * trigger a rerender when there's a change from light to dark
 * theme or vice versa.
 * @param {string} name Name of the css variable
 * @param {node} DOMNode By default `:root` is used, but optionally, you can use a different dom node
 * @returns {string} Value of the CSS variable at the current time
 */
function useCssVar(name, node) {
  const isDarkMode = useIsDarkMode();
  const [value, setValue] = useState(getCssVar(name, node));
  useIsomorphicLayoutEffect(() => {
    setValue(getCssVar(name, node));
  }, [name, node, isDarkMode]);
  return value;
}

export default useCssVar;
