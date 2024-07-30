import {hydrateRoot} from 'react-dom/client';

import {
  HYDRATION_DATA_PLAINTEXT_KEY,
  HYDRATION_DATA_ENCRYPTED_KEY,
  DATA_PROP_ATTR,
} from 'starterkit/constants.js';
import {pythonValueToJs} from 'starterkit/utils/utils.js';
import {decrypt} from 'core/utils/crypto.js';

const DATA_PROP_ATTR_BROWSER = DATA_PROP_ATTR.replace('data-', '');

if (typeof window !== 'undefined' && !window.zgReactRoots) {
  // save react roots in weak map so they get garbage collected
  // if the nodes are removed
  window.zgReactRoots = new WeakMap();
}

const isProd = import.meta.env.PROD;

// renders a Preact component into every element with a certain class,
// using the JSON inside the element as props
// so different instances of an element can be configured –
// e.g. multiple charts showing different parts of a dataset
function renderReactComponent({
  selector = null,
  Component,
  appId,
  props = {},
  callback = null,
} = {}) {
  const elements = document.querySelectorAll(selector);

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    // get values from html data attributes
    let options = {};
    let id;
    const dataset = element.dataset;

    for (const key in dataset) {
      if (key.startsWith(DATA_PROP_ATTR_BROWSER)) {
        let cleanKey = key.replace(DATA_PROP_ATTR_BROWSER, '');
        cleanKey = cleanKey[0].toLowerCase() + cleanKey.slice(1);
        const value = pythonValueToJs(dataset[key]);
        options[cleanKey] = value;
        if (cleanKey === 'id') {
          id = value;
        }
      }
    }

    const render = async () => {
      const root = window.zgReactRoots.get(element);
      let hydrationData = window?.zgStaticPropsHydration?.[appId]?.[id];
      if (hydrationData) {
        if (hydrationData[HYDRATION_DATA_PLAINTEXT_KEY]) {
          hydrationData = hydrationData[HYDRATION_DATA_PLAINTEXT_KEY];
        } else if (hydrationData[HYDRATION_DATA_ENCRYPTED_KEY]) {
          hydrationData = await decrypt(
            hydrationData[HYDRATION_DATA_ENCRYPTED_KEY],
          );
          hydrationData = JSON.parse(hydrationData);
        }
      }

      if (root) {
        if (isProd) {
          root.render(<Component {...props} {...options} {...hydrationData} />);
        }
      } else {
        const root = hydrateRoot(
          element,
          <Component {...props} {...options} {...hydrationData} />,
        );
        window.zgReactRoots.set(element, root);

        if (callback) {
          callback(element);
        }
      }
    };

    render();
  }
}

export default renderReactComponent;
