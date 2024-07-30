import STARTERKIT_CONFIG from 'src/__starterkit_config.json';

// TODO: Test! does this work in production?
const isProd = import.meta.env.PROD;

export const cssPrefix = STARTERKIT_CONFIG?.deploymentPath.replace(/\//g, '-');

/**
 * Function that returns the value of a given CSS variable name.
 * Caution: On the server, it returns `undefined`, so take care
 * of that case in your code. The change of the theme will not render
 * a reexecution or rerender in any way, so get the value again
 * after a theme change (light/dark).
 * @param {string} name Name of the css variable
 * @param {node} DOMNode By default `:root` is used, but optionally, you can use a different dom node
 * @returns {string} Value of the CSS variable at the current time
 */
function getCssVar(name, node) {
  if (typeof window === 'undefined') return;
  const actualName = name.replace(
    '--duv-',
    typeof __PROJECT_PREFIX__ !== 'undefined'
      ? '--' + __PROJECT_PREFIX__ + '-duv-'
      : '--duv-',
  );

  return getComputedStyle(node || document.documentElement).getPropertyValue(
    actualName,
    // isProd ? actualName : name,
  );
}

export default getCssVar;
